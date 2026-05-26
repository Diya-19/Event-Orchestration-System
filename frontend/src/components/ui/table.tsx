import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ className = "", ...props }: HTMLAttributes<HTMLTableElement>) {

  return (

    <div className="w-full overflow-hidden rounded-xl border border-gray-200">

      <table className={`w-full text-sm ${className}`} {...props} />

    </div>

  );

}

export function TableHead({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {

  return <thead className={`bg-gray-50 border-b border-gray-200 ${className}`} {...props} />;

}

export function TableBody({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {

  return <tbody className={`divide-y divide-gray-100 ${className}`} {...props} />;

}

export function TableRow({ className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {

  return <tr className={`hover:bg-gray-50 transition-colors ${className}`} {...props} />;

}

export function TableHeader({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {

  return (

    <th

      className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${className}`}

      {...props}

    />

  );

}

export function TableCell({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {

  return <td className={`px-4 py-3 text-gray-700 ${className}`} {...props} />;

}
