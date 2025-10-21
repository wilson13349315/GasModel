import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instruments } = await supabase.from('instruments').select()
  if (!instruments || instruments.length === 0)
    return <p className="text-center mt-10">No data found</p>

  return (
    <div className="p-6">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {Object.keys(instruments[0]).map((col) => (
              <th key={col} className="border-b px-4 py-2 text-left font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {instruments.map((row, i) => (
            <tr key={i} className="even:bg-gray-50">
              {Object.values(row).map((val, j) => (
                <td key={j} className="border-b px-4 py-2">
                  {String(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
