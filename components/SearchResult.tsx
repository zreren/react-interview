import type { Repository, APIResponse } from '../types/api.type'
import HistoryItem from './History'
import LoadingIcon from './LoadingIcon'
import { RepositoryOption } from './RepositoryOption'
import { TrashIcon } from '@heroicons/react/20/solid'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef } from 'react'
import { Spring, animated, useTransition } from '@react-spring/web'

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


  const transitions = useTransition(true, {
    from: { opacity: 0, transform: 'translateX(8px)' },
    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: { opacity: 0 },
    delay:50,
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
