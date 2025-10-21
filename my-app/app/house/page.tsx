"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

type ChartRow = { location: string; avg_price: number }

export default function HousePage() {
  const [data, setData] = useState<ChartRow[]>([])

  const downloadCSV = () => {
    if (!data || data.length === 0) return
  
    const header = ["Location", "Average Price"]
    const rows = data.map((row) => [row.location, row.avg_price])
  
    const csvContent =
      [header, ...rows]
        .map((e) => e.join(","))
        .join("\n")
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "house_top10.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: rows, error } = await supabase
        .from("house")
        .select('location, "Price (in rupees)"')

      if (error) {
        console.error(error)
        return
      }

      const grouped: Record<string, number[]> = (rows ?? []).reduce(
        (acc: Record<string, number[]>, row: { location?: string; "Price (in rupees)": number | string | null }) => {
          const loc = row?.location
          const raw = row?.["Price (in rupees)"]
          const num = typeof raw === "number" ? raw : raw != null ? Number(String(raw).replace(/[^\d.-]/g, "")) : NaN
          if (loc && Number.isFinite(num)) {
            acc[loc] = acc[loc] || []
            acc[loc].push(num)
          }
          return acc
        },
        {} as Record<string, number[]>
      )

      const averages: ChartRow[] = Object.entries(grouped).map(([loc, prices]) => ({
        location: loc,
        avg_price: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      }))

      const top10 = averages.sort((a, b) => b.avg_price - a.avg_price).slice(0, 10)
      setData(top10)
    }
    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Top 10 Locations by Average House Price</h1>

      {/* Download button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
          </svg>
          Download CSV
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" angle={-30} textAnchor="end" height={60} />
          <YAxis tickFormatter={(v) => `$${Math.round(Number(v)).toLocaleString()}`} />
          <Tooltip formatter={(v: number) => `$${Math.round(Number(v)).toLocaleString()}`} />
          <Bar dataKey="avg_price" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}