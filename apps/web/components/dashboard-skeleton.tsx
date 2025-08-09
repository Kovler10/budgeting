"use client";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded-md bg-muted/70 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
          <div className="h-9 w-32 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2 pb-2">
              <div className="h-4 w-28 rounded bg-muted animate-pulse" />
              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-7 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-36 rounded bg-muted/70 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Lists skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="space-y-2">
              <div className="h-5 w-40 rounded bg-muted animate-pulse" />
              <div className="h-4 w-56 rounded bg-muted/70 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-24 rounded bg-muted/70 animate-pulse" />
                  </div>
                  <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="space-y-2">
              <div className="h-5 w-36 rounded bg-muted animate-pulse" />
              <div className="h-4 w-44 rounded bg-muted/70 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full rounded-md bg-muted animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
