import React from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { classNames } from '../lib/utils'
import {
    CpuChipIcon,
    StarIcon,
    ViewfinderCircleIcon,
} from '@heroicons/react/24/outline'

interface HistoryItemProps {
    search: string
    index: number | string
}

const historyItem = (props: HistoryItemProps) => {
    const { search, index } = props
    return (
        <Combobox.Option
            key={index}
            value={search}
            className={({ active }) =>
                classNames(
                    'flex flex-col cursor-default select-none justify-center px-4 py-3 space-y-1.5',
                    active ? 'bg-indigo-300/20 text-white' : 'text-gray-300'
                )
            }
        >
            {({ active }) => (
                <header className="flex items-center h-5 ">
                    <CpuChipIcon
                        className={(classNames(
                            'h-5 w-5 flex-none',
                            active ? 'text-white' : 'text-gray-200'
                        ))}
                        aria-hidden="true"
                    />
                    <span className='ml-2'> {search}</span>
                </header>
            )}
        </Combobox.Option>
    )
}

export default historyItem
