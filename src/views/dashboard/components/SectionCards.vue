<script setup lang="ts">
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-vue-next'
</script>

<template>
  <div
    class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
  >
    <Card class="@container/card">
      <CardHeader class="relative">
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> $1,250.00 </CardTitle>
        <div class="absolute top-4 right-4">
          <Badge variant="outline" class="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon class="size-3" />
            +12.5%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <TrendingUpIcon class="size-4" /></div>
        <div class="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader class="relative">
        <CardDescription>New Customers</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> 1,234 </CardTitle>
        <div class="absolute top-4 right-4">
          <Badge variant="outline" class="flex gap-1 rounded-lg text-xs">
            <TrendingDownIcon class="size-3" />
            -20%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">Down 20% this period <TrendingDownIcon class="size-4" /></div>
        <div class="text-muted-foreground">Acquisition needs attention</div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader class="relative">
        <CardDescription>Active Accounts</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> 45,678 </CardTitle>
        <div class="absolute top-4 right-4">
          <Badge variant="outline" class="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon class="size-3" />
            +12.5%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">Strong user retention <TrendingUpIcon class="size-4" /></div>
        <div class="text-muted-foreground">Engagement exceed targets</div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader class="relative">
        <CardDescription>Growth Rate</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> 4.5% </CardTitle>
        <div class="absolute top-4 right-4">
          <Badge variant="outline" class="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon class="size-3" />
            +4.5%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1 text-sm">
        <div class="line-clamp-1 flex gap-2 font-medium">Steady performance <TrendingUpIcon class="size-4" /></div>
        <div class="text-muted-foreground">Meets growth projections</div>
      </CardFooter>
    </Card>
  </div>
</template>
