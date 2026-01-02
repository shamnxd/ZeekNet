
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, Eye, ClipboardList } from 'lucide-react';
import type { AnalyticsData, ViewRange, VisitorStat } from '@/interfaces/job/job-details.types';

interface JobAnalyticsTabProps {
    analyticsData: AnalyticsData;
    viewRange: ViewRange;
    setViewRange: (range: ViewRange) => void;
    chartWidth: number;
    chartHeight: number;
    areaPath: string;
    linePath: string;
    chartCoordinates: { label: string; x: number; y: number; views: number }[];
    lastCoordinate: { label: string; x: number; y: number; views: number } | undefined;
    trafficSegments: { label: string; value: number; color: string; start: number; end: number }[];
}

export const JobAnalyticsTab: React.FC<JobAnalyticsTabProps> = ({
    analyticsData,
    viewRange,
    setViewRange,
    chartWidth,
    chartHeight,
    areaPath,
    linePath,
    chartCoordinates,
    lastCoordinate,
    trafficSegments,
}) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="border border-[#D6DDEB]">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-[#7C8493]">Total Views</p>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="text-3xl font-semibold text-[#25324B]">
                                    {analyticsData.totalViews.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 text-sm font-medium text-[#1F8A70]">
                                    <ArrowUpRight className="h-4 w-4" />
                                    {analyticsData.totalViewsChange}%
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-[#7C8493]">vs last day</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9EBFD] text-[#4640DE]">
                            <Eye className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-[#D6DDEB]">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-[#7C8493]">Total Applied</p>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="text-3xl font-semibold text-[#25324B]">
                                    {analyticsData.totalApplied.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 text-sm font-medium text-[#E5484D]">
                                    <ArrowDownRight className="h-4 w-4" />
                                    {Math.abs(analyticsData.totalAppliedChange)}%
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-[#7C8493]">vs last day</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2FB] text-[#EB53A2]">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Card className="border border-[#D6DDEB] xl:col-span-2">
                    <CardContent className="p-6">
                        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-[#25324B]">Job Listing View stats</h3>
                            </div>
                            <Select value={viewRange} onValueChange={(value: ViewRange) => setViewRange(value)}>
                                <SelectTrigger className="w-36 rounded-lg border-[#D6DDEB] bg-white">
                                    <SelectValue placeholder="Last 7 days" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="14d">Last 14 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="relative">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C0C6F0" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#C0C6F0" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={areaPath} fill="url(#chartGradient)" />
                                <path d={linePath} fill="none" stroke="#4640DE" strokeWidth="3" strokeLinecap="round" />
                                {chartCoordinates.map((coordinate, index) => (
                                    <circle
                                        key={coordinate.label}
                                        cx={coordinate.x}
                                        cy={coordinate.y}
                                        r={index === chartCoordinates.length - 1 ? 6 : 4}
                                        fill="#FFFFFF"
                                        stroke="#4640DE"
                                        strokeWidth="2"
                                    />
                                ))}
                            </svg>
                            {lastCoordinate && (
                                <div
                                    className="absolute rounded-lg bg-[#202430] px-3 py-2 text-xs text-white shadow-md"
                                    style={{
                                        left: Math.min(chartWidth - 120, Math.max(0, lastCoordinate.x - 40)),
                                        top: Math.max(0, lastCoordinate.y - 50),
                                    }}
                                >
                                    <div className="font-semibold">Views</div>
                                    <div>{lastCoordinate.views}</div>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-between text-xs text-[#7C8493]">
                            {chartCoordinates.map((coordinate) => (
                                <span key={coordinate.label} className="min-w-[40px] text-center">
                                    {coordinate.label}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-5">
                    <Card className="border border-[#D6DDEB]">
                        <CardContent className="p-6 space-y-5">
                            <h3 className="text-lg font-semibold text-[#25324B]">Traffic channel</h3>
                            <div className="flex items-center gap-6">
                                <div
                                    className="relative h-36 w-36 rounded-full"
                                    style={{
                                        background: `conic-gradient(${trafficSegments
                                            .map(
                                                (segment) =>
                                                    `${segment.color} ${segment.start * 360}deg ${(segment.end * 360)}deg`
                                            )
                                            .join(', ')})`,
                                    }}
                                >
                                    <div className="absolute inset-6 rounded-full bg-white" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-xs text-[#7C8493]">Views</p>
                                            <p className="text-xl font-semibold text-[#25324B]">243</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {trafficSegments.map((segment) => (
                                        <div key={segment.label} className="flex items-center gap-3">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: segment.color }}
                                            />
                                            <span className="text-sm text-[#25324B] w-20">{segment.label}</span>
                                            <span className="text-sm font-semibold text-[#25324B]">
                                                {segment.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-[#D6DDEB]">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-[#25324B]">Visitors by country</h3>
                            <div className="space-y-3">
                                {analyticsData.visitors.map((visitor: VisitorStat) => (
                                    <div key={visitor.country} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{visitor.flag}</span>
                                            <span className="text-[#25324B]">{visitor.country}</span>
                                        </div>
                                        <span className="font-semibold text-[#25324B]">
                                            {visitor.count.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
