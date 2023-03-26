import type { Repository, APIResponse } from '../types/api.type'
import HistoryItem from './History'
import LoadingIcon from './LoadingIcon'
import { RepositoryOption } from './RepositoryOption'
import { TrashIcon } from '@heroicons/react/20/solid'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef } from 'react'
import { Spring, animated, useTransition, config } from '@react-spring/web'

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

const SearchHeader = ({
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
  
  const [open, setOpen] = useState(true)
  const DURATION = 400;
  const delayedSetOpen = useCallback(
    (value:boolean) => {
      const timeoutId = setTimeout(() => {
        return setOpen(value)
      }, DURATION);
      return () => clearTimeout(timeoutId);
    },
    []
  );

  useEffect(() => {
    if (searchHistory.length > 0) {
      delayedSetOpen(true);
    } else {
      delayedSetOpen(false);
    }
  }, [searchHistory, delayedSetOpen]);



  const transitions = useTransition(searchHistory, {
    from: { opacity: 1 },
    enter: { opacity: 1, height: '44px' },
    keys: (item) => item,
    leave: { opacity: 0.01, height: '0px' },
    config: {
      ...config.default,
      tension: 20,
      mass: 10,
      friction: 200,
      duration: DURATION,
    },
  })
  const transitionsState = useTransition(open, {
    from: { opacity: 0, height: '0px' },
    enter: { opacity: 1, height: '44px' },
    config: {
      mass: 10,
      friction: 5,
      tension: 10,
      duration: DURATION
    },
  })

  if (!open) {
    return (
       <>
        {
          transitionsState((style)=>{
            return (
              <animated.div style={style}>
              <span className="flex h-11 items-center justify-center text-sm text-gray-200">
                No History Yet
                </span>
              </animated.div>
            )
          })
        }
       </>
    )
  }

  return (
    <>
      {transitions((style, item) => {
        return (
          <animated.div style={style}>
            <div>{<HistoryItem key={item} index={item} search={item} />}</div>
          </animated.div>
        )
      })}
    </>
  )
}

const RepositoryOptions = ({
  searchResult,
  isValidating,
  query,
}: RepositoryOptionsProps) => {
  const transitions = useTransition(true, {
    from: { opacity: 0, transform: 'translateX(8px)' },
    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: { opacity: 0 },
    delay: 50,
    config: {
      mass: 10,
      friction: 5,
      tension: 10,
      duration: 100,
    },
  })

  if (!searchResult?.items && isValidating) {
    return transitions(
      (style, item) =>
        item && (
          <animated.div style={style} className="animate-pulse">
            <LoadingIcon />
          </animated.div>
        )
    )
  }

  const NoResult = () => {
    return transitions(
      (style, item) =>
        item && (
          <animated.div style={style}>
            <span className="flex h-10 animate-pulse items-center justify-center">
              No Results Found
            </span>
          </animated.div>
        )
    )
  }

  return (
    <div>
      {
        searchResult?.items?.length ? (
          searchResult?.items?.map((repository, index) => (
            <RepositoryOption key={index} query={query} {...repository} />
          ))
        ) : (
          <NoResult></NoResult>
        )
        // <span className="flex h-10 animate-pulse items-center justify-center">
        //   No Results Found
        // </span>
      }
    </div>
  )
}

const SearchResults = ({
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

const Search = {
  Header: SearchHeader,
  Result: SearchResults,
}
export default Search
