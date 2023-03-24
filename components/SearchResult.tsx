import type { Repository, APIResponse } from '../types/api.type'
import HistoryItem from './History'
import LoadingIcon from './LoadingIcon'
import { RepositoryOption } from './RepositoryOption'
import { TrashIcon } from '@heroicons/react/20/solid'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef } from 'react'

const transitionStyles = {
  entering: 'opacity-0',
  entered: 'opacity-100',
  exiting: 'opacity-100',
  exited: 'opacity-0',
}

interface SearchResultsProps {
  query: string
  searchHistory: string[]
  searchResult: APIResponse | null | undefined
  isValidating: boolean
}

interface SearchHistoryProps {
  searchHistory: string[]
}

interface RepositoryOptionsProps {
  searchResult: APIResponse | null | undefined
  isValidating: boolean
  query: string
}

export const SearchResults = ({
  query,
  searchHistory,
  searchResult,
  isValidating,
}: SearchResultsProps) => {
  return (
    <div>
      {query === '' ? (
        <SearchHistory searchHistory={searchHistory} />
      ) : (
        <RepositoryOptions
          searchResult={searchResult}
          isValidating={isValidating}
          query={query}
        />
      )}
    </div>
  )
}

export const SearchHeader = ({
  query,
  onClick,
}: {
  query: string
  onClick: () => void
}) => {
  return (
    <h2 className="px-4 py-4 text-xs font-semibold text-gray-200">
      {query !== '' ? (
        'Repositories'
      ) : (
        <div className="flex items-center justify-between">
          <div>History List</div>
          <TrashIcon
            className="h-4 w-4 cursor-pointer"
            onClick={onClick}
          ></TrashIcon>
        </div>
      )}
    </h2>
  )
}
const SearchHistory = ({ searchHistory }: SearchHistoryProps) => {
  return (
    <div>
      {searchHistory?.length > 0 ? (
        searchHistory.map((searchQuery, index) => (
          <HistoryItem key={index} index={index} search={searchQuery} />
        ))
      ) : (
        <span className="flex h-10 items-center justify-center text-sm text-gray-200">
          No History Yet
        </span>
      )}
    </div>
  )
}

const RepositoryOptions = ({
  searchResult,
  isValidating,
  query,
}: RepositoryOptionsProps) => {

  const [open, setOpen] = useState(false)

  const showResult = useCallback(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(showResult, 800)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [showResult])

  if (!searchResult?.items && isValidating) {
    return (
      <Transition.Root show={isValidating}>
        <div className="animate-pulse">
          <Transition.Child
            enter="transition-opacity duration-1000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-1000"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <LoadingIcon />
          </Transition.Child>
        </div>
      </Transition.Root>
    )
  }

  return (
    <div>
      <Transition.Root
        show={open}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition transform duration-400"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {searchResult?.items?.length ? (
          searchResult?.items?.map((repository, index) => (
            <RepositoryOption key={index} query={query} {...repository} />
          ))
        ) : <span className="flex h-10 animate-pulse items-center justify-center">
        No Results Found
      </span>}
      </Transition.Root>
    </div>
  )

}
