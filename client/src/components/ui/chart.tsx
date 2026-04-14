"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode
    color?: string
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
}) {
  const chartId = React.useId()
  const resolvedId = `chart-${id || chartId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={resolvedId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: Object.entries(config)
              .map(([key, item]) => {
                if (!item?.color) return ""
                return `[data-chart=${resolvedId}] { --color-${key}: ${item.color}; }`
              })
              .join("\n"),
          }}
        />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipPayloadItem = {
  name?: string
  value?: string | number
  color?: string
  dataKey?: string | number
  payload?: { fill?: string }
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: TooltipPayloadItem[]
  className?: string
  indicator?: "line" | "dot" | "dashed"
  hideLabel?: boolean
  nameKey?: string
  labelKey?: string
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) return null

  const label = payload[0]?.name

  return (
    <div className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
      {!hideLabel && label ? <div className="font-medium">{label}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((item: TooltipPayloadItem, index: number) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const cfg = config[key] || config[item.dataKey as string] || {}
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className={cn(
                  "shrink-0 rounded-[2px]",
                  indicator === "dot" && "h-2.5 w-2.5",
                  indicator === "line" && "h-0.5 w-3",
                  indicator === "dashed" && "h-0.5 w-3 border-t border-dashed"
                )}
                style={{
                  backgroundColor: item.color || (item.payload?.fill as string),
                  borderColor: item.color || (item.payload?.fill as string),
                }}
              />
              <span className="text-muted-foreground">
                {cfg.label || item.name || labelKey || "Value"}
              </span>
              <span className="ml-auto font-mono font-medium text-foreground">
                {item.value?.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
}
