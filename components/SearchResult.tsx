import type  Repository  from '../types/api.type'
import HistoryItem from './History';
import LoadingIcon from './LoadingIcon';
import { RepositoryOption } from './RepositoryOption';
import {TrashIcon} from '@heroicons/react/20/solid';
import { MouseEventHandler } from 'react';

interface SearchResultsProps {
  query: string;
  searchHistory: string[];
  searchResult: {
    items: Repository[];
  } | null;
  isValidating: boolean;
}

interface SearchHistoryProps {
  searchHistory: string[];
}

interface RepositoryOptionsProps {
  searchResult: {
    items: Repository[];
  } | null;
  isValidating: boolean;
  query: string;
}

export const SearchResults = ({ query, searchHistory, searchResult, isValidating }: SearchResultsProps) => {
  return (
    <div>
      {query === '' ? (
        <SearchHistory searchHistory={searchHistory} />
      ) : (
        <RepositoryOptions searchResult={searchResult} isValidating={isValidating} query={query} />
      )}
    </div>
  )
}


export const SearchHeader = ({ query, onClick }: { query: string, onClick: () => void }) => {
  return (
    <h2 className="text-xs font-semibold text-gray-200 px-4 py-4">
      {query !== '' ? (
        'Repositories'
      ) : (
        <div className='flex justify-between items-center'>
          <div>History List</div>
          <TrashIcon className='h-4 w-4 cursor-pointer' onClick={onClick}></TrashIcon>
        </div>
      )}
    </h2>
  )
}
const SearchHistory = ({ searchHistory }: SearchHistoryProps) => {
  return (
    <div>
      {searchHistory ? (
        searchHistory.map((searchQuery, index) => (
          <HistoryItem key={index} index={index} search={searchQuery} />
        ))
      ) : (
        <span className='flex justify-center text-gray-200 text-sm h-10 items-center'>No History Yet</span>
      )}
    </div>
  )
}

const RepositoryOptions = ({ searchResult, isValidating, query }: RepositoryOptionsProps) => {
  return (
    <div>
      {searchResult?.items ? (
        searchResult.items.map((repository, index) => (
          <RepositoryOption key={index} query={query} {...repository} />
        ))
      ) : isValidating ? (
        <LoadingIcon />
      ) : (
        <span className='flex items-center justify-center h-10'>No Results Found</span>
      )}
    </div>
  )
}
