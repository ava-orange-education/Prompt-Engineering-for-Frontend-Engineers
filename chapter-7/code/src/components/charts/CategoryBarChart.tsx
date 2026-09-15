import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import 'd3-transition'
import { scaleBand, scaleLinear } from 'd3-scale'
import { axisLeft } from 'd3-axis'
import { max } from 'd3-array'
import { easeCubicOut } from 'd3-ease'
import type { CategorySales } from '@/types'

interface CategoryBarChartProps {
  data: CategorySales[]
  dark?: boolean
}

export function CategoryBarChart({ data, dark = true }: CategoryBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    const container = containerRef.current
    const sorted = [...data].sort((a, b) => b.revenue - a.revenue)
    const axisColor = dark ? '#9CA3AF' : '#374151'

    function render() {
      const svg = select(svgRef.current)
      svg.selectAll('*').remove()

      const width = container.clientWidth
      const height = 280
      const margin = { top: 10, right: 50, bottom: 20, left: 110 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      svg.attr('width', width).attr('height', height)

      const defs = svg.append('defs')
      const barGrad = defs
        .append('linearGradient')
        .attr('id', 'barGrad')
        .attr('x1', '0')
        .attr('y1', '0')
        .attr('x2', '1')
        .attr('y2', '0')
      barGrad.append('stop').attr('offset', '0%').attr('stop-color', '#2563EB')
      barGrad.append('stop').attr('offset', '100%').attr('stop-color', '#60A5FA')

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const y = scaleBand()
        .domain(sorted.map((d) => d.category))
        .range([0, innerHeight])
        .padding(0.3)

      const x = scaleLinear()
        .domain([0, (max(sorted, (d) => d.revenue) ?? 0) * 1.1])
        .range([0, innerWidth])

      g.append('g')
        .call(axisLeft(y).tickSize(0))
        .call((axis) => axis.select('.domain').remove())
        .selectAll('text')
        .attr('fill', axisColor)
        .attr('font-size', '12px')

      const bars = g
        .selectAll<SVGRectElement, CategorySales>('.bar')
        .data(sorted)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d) => y(d.category)!)
        .attr('height', y.bandwidth())
        .attr('x', 0)
        .attr('width', 0)
        .attr('fill', 'url(#barGrad)')
        .attr('rx', 4)
        .style('cursor', 'pointer')
        .on('mouseenter', function () {
          select(this).attr('fill', '#93C5FD')
        })
        .on('mouseleave', function () {
          select(this).attr('fill', 'url(#barGrad)')
        })

      bars
        .transition()
        .duration(600)
        .ease(easeCubicOut)
        .delay((_, i) => i * 60)
        .attr('width', (d) => x(d.revenue))

      g.selectAll('.bar-label')
        .data(sorted)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', (d) => x(d.revenue) + 8)
        .attr('y', (d) => (y(d.category) ?? 0) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('fill', '#D1D5DB')
        .attr('font-size', '12px')
        .attr('opacity', 0)
        .text((d) => `$${Math.round(d.revenue / 1000)}k`)
        .transition()
        .duration(300)
        .delay((_, i) => i * 60 + 500)
        .attr('opacity', 1)
    }

    render()

    const resizeObserver = new ResizeObserver(() => render())
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [data, dark])

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Revenue by Category
      </h3>
      <svg ref={svgRef} data-testid="chart-svg" className="w-full overflow-visible" />
    </div>
  )
}
