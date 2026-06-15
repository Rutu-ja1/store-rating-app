// src/components/SortableTable.tsx
import { useState, type JSX } from 'react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
}

interface Props {
    columns: Column[];
    data: any[];
    renderRow: (row: any) => JSX.Element;
}

export function SortableTable({ columns, data, renderRow }: Props) {
    const [sort, setSort] = useState({ key: '', dir: 'asc' as 'asc' | 'desc' });

    const sorted = [...data].sort((a, b) => {
        if (!sort.key) return 0;
        const v = String(a[sort.key] || '').localeCompare(String(b[sort.key] || ''));
        return sort.dir === 'asc' ? v : -v;
    });

    const toggle = (key: string) =>
        setSort(s => ({
            key,
            dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc',
        }));

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable && toggle(col.key)}
                                className={`px-4 py-3 text-left font-medium text-gray-600
                  ${col.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}`}
                            >
                                {col.label}
                                {col.sortable
                                    ? sort.key === col.key
                                        ? sort.dir === 'asc' ? ' ↑' : ' ↓'
                                        : ' ↕'
                                    : ''}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sorted.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}
                                className="px-4 py-8 text-center text-gray-400">
                                No data found
                            </td>
                        </tr>
                    ) : (
                        sorted.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                {renderRow(row)}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}