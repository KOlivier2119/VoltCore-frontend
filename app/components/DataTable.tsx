'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({ columns, data, renderActions }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)} onClick={() => handleSort(column.key)} className="cursor-pointer">
              {column.label}
            </TableHead>
          ))}
          {renderActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>{String(item[column.key])}</TableCell>
            ))}
            {renderActions && <TableCell>{renderActions(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}