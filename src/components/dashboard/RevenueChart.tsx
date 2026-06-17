"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

interface Props { data: { month: string; revenue: number }[] }

export function RevenueChart({ data }: Props) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const gridColor  = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
  const textColor  = isDark ? "#6b7280"                 : "#9ca3af"
  const barColor   = "#14b8a6"

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v}`}
        />
        <Tooltip
            contentStyle={{
                background: isDark ? "#1e2535" : "#ffffff",
                border: isDark ? "1px solid #2d3748" : "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                fontSize: 13,
            }}
            labelStyle={{ color: isDark ? "#e2e8f0" : "#1a202c", fontWeight: 600, marginBottom: 4 }}
            
            // CHANGEMENT ICI : On utilise (v: any) pour éviter le conflit de type avec Recharts
            formatter={(v: any) => [`$${v}`, "إيرادات"] as [string, string]}
            
            cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
        />
        <Bar dataKey="revenue" fill={barColor} radius={[8, 8, 0, 0]} maxBarSize={52} />
      </BarChart>
    </ResponsiveContainer>
  )
}