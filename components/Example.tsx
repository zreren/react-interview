import React from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { RepositoryOption } from './RepositoryOption'
import { FaceSmileIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import useSwr from "swr";
import {Repository} from '../types/api.type';
import { useRouter } from 'next/router';
import { SearchResults,SearchHeader } from './SearchResult';
import { highlightMatchedText } from '../lib/highlightMatchedText';




export default function Example() {
  const [open, setOpen] = React.useState(true)

  const router = useRouter();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && ['K', 'k'].includes(event.key)) {
        setOpen(true);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const [rawQuery, setRawQuery] = React.useState('')

  const query = React.useMemo(() => rawQuery.toLowerCase().replace(/^[#>]/, ''), [rawQuery])

  // useSWR 自带防抖
  const { data: searchResult, isValidating } = useSwr<APIResponse>(query ? `/api/search?q=${query}` : null, (url) => fetch(url).then((res) => res.json()), {
    dedupingInterval: 300,
  })


  const [searchHistory, setSearchHistory] = React.useState<string[]>(() => {
    const storedHistory =
      typeof window !== 'undefined' ? window.localStorage.getItem('searchHistory') : null;
    // Check if the stored history is not null and not an empty array before parsing
    return storedHistory && storedHistory.length ? JSON.parse(storedHistory) : [];
  });

  React.useEffect(() => {
    if (query && !searchHistory.includes(query)) {
      const newSearchHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
      // Check if the new search history is different from the existing one before updating the local storage
      if (JSON.stringify(newSearchHistory) !== JSON.stringify(searchHistory)) {
        window.localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
        // Set the new search history in state only if it is different from the existing one
        setSearchHistory(newSearchHistory);
      }
    }
  }, [query, searchHistory]);


  const deleteHistory = () => {
    setSearchHistory([]);
    window.localStorage.setItem('searchHistory', JSON.stringify([]));
  }


  return (
    <Transition.Root
      show={open}
      as={React.Fragment}
      afterLeave={() => setRawQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={React.Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="opacity-0 scale-95 -translate-y-full"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 -translate-y-full"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-2xl shadow-slate-300/10 bg-slate-900/70 shadow-2xl ring-1 ring-sky-500 ring-opacity-5 backdrop-blur-xl backdrop-filter transition-all">
              <Combobox
                value=""
                onChange={(item) => {
                  if (query === '') {
                    setRawQuery(item)
                    return
                  }
                  window.open(item, '_blank')
                }}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:ring-0 sm:text-sm focus:outline-0"
                    placeholder="Search GitHub repos..."
                    value={rawQuery}
                    onChange={(event) => setRawQuery(event.target.value)}
                  />
                </div>
                <SearchHeader query={query} onClick={deleteHistory}></SearchHeader>
                <SearchResults query={query} searchHistory={searchHistory} searchResult={searchResult} isValidating={isValidating} />
                <span className="flex flex-wrap items-center bg-slate-900/20 py-2.5 px-4 text-xs text-gray-400">
                  <FaceSmileIcon className="w-4 h-4 mr-1" />
                  Welcome to Zolplay&apos;s React Interview Challenge.
                </span>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
