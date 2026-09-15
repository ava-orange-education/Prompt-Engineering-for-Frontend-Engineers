import { useEffect, useRef } from 'react'
import { select, pointer } from 'd3-selection'
import 'd3-transition'
import { scalePoint, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { max, bisector } from 'd3-array'
import { area as areaShape, line as lineShape, curveMonotoneX } from 'd3-shape'
import { easeCubicOut } from 'd3-ease'
import type { MonthlySales } from '@/types'

interface RevenueAreaChartProps {
  data: MonthlySales[]
  width?: number
  height?: number
  dark?: boolean
}

export function RevenueAreaChart({ data, height = 280, dark = true }: RevenueAreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    const container = containerRef.current
    const axisColor = dark ? '#9CA3AF' : '#374151'

    function render() {
      const svg = select(svgRef.current)
      svg.selectAll('*').remove()

      const width = container.clientWidth
      const margin = { top: 20, right: 20, bottom: 60, left: 55 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      svg.attr('width', width).attr('height', height)

      const defs = svg.append('defs')
      const gradient = defs
        .append('linearGradient')
        .attr('id', 'areaGrad')
        .attr('x1', '0')
        .attr('y1', '0')
        .attr('x2', '0')
        .attr('y2', '1')
      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#3B82F6').attr('stop-opacity', 0.4)
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3B82F6').attr('stop-opacity', 0)

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const x = scalePoint()
        .domain(data.map((d) => d.month))
        .range([0, innerWidth])
        .padding(0.2)

      const y = scaleLinear()
        .domain([0, (max(data, (d) => d.revenue) ?? 0) * 1.15])
        .range([innerHeight, 0])

      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(axisBottom(x))
        .call((axis) => axis.select('.domain').attr('stroke', '#4B5563'))
        .selectAll('text')
        .attr('fill', axisColor)
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end')

      g.append('g')
        .call(axisLeft(y).ticks(5).tickFormat((v) => `$${Number(v) / 1000}k`))
        .call((axis) => axis.select('.domain').attr('stroke', '#4B5563'))
        .selectAll('text')
        .attr('fill', axisColor)

      const area = areaShape<MonthlySales>()
        .x((d) => x(d.month) ?? 0)
        .y0(innerHeight)
        .y1((d) => y(d.revenue))
        .curve(curveMonotoneX)

      g.append('path').datum(data).attr('d', area).attr('fill', 'url(#areaGrad)')

      const line = lineShape<MonthlySales>()
        .x((d) => x(d.month) ?? 0)
        .y((d) => y(d.revenue))
        .curve(curveMonotoneX)

      const linePath = g
        .append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 2)

      const totalLength = linePath.node()!.getTotalLength()
      linePath
        .attr('stroke-dasharray', totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(800)
        .ease(easeCubicOut)
        .attr('stroke-dashoffset', 0)

      // Hover tooltip: vertical rule + dot + floating box
      const tooltip = select(container)
        .append('div')
        .attr(
          'class',
          'pointer-events-none absolute hidden rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg',
        )

      const hoverLine = g
        .append('line')
        .attr('stroke', '#6B7280')
        .attr('stroke-dasharray', '2,2')
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .style('opacity', 0)

      const hoverDot = g
        .append('circle')
        .attr('r', 4)
        .attr('fill', '#3B82F6')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 0)

      const bisectMonth = bisector<MonthlySales, string>((d) => d.month).left

      g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .on('mousemove', (event: MouseEvent) => {
          const [mx] = pointer(event)
          const domain = x.domain()
          const step = innerWidth / (domain.length - 1 || 1)
          const index = Math.max(0, Math.min(domain.length - 1, Math.round(mx / step)))
          const point = data[bisectMonth(data, domain[index])] ?? data[index]
          if (!point) return

          const px = x(point.month) ?? 0
          const py = y(point.revenue)

          hoverLine.attr('x1', px).attr('x2', px).style('opacity', 1)
          hoverDot.attr('cx', px).attr('cy', py).style('opacity', 1)

          tooltip
            .html(`<strong>${point.month}</strong><br/>$${point.revenue.toLocaleString()}`)
            .style('left', `${margin.left + px + 12}px`)
            .style('top', `${margin.top + py - 12}px`)
            .classed('hidden', false)
        })
        .on('mouseleave', () => {
          hoverLine.style('opacity', 0)
          hoverDot.style('opacity', 0)
          tooltip.classed('hidden', true)
        })
    }

    render()

    const resizeObserver = new ResizeObserver(() => render())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      select(container).selectAll('.pointer-events-none').remove()
    }
  }, [data, height, dark])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Monthly Revenue
      </h3>
      <svg ref={svgRef} data-testid="chart-svg" className="w-full overflow-visible" />
    </div>
  )
}
