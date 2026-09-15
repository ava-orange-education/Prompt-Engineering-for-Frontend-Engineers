import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import 'd3-transition'
import { scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { max } from 'd3-array'
import { line } from 'd3-shape'
import { regressionLinear } from 'd3-regression'
import type { CustomerLTV } from '@/types'

interface LtvScatterPlotProps {
  data: CustomerLTV[]
  dark?: boolean
}

export function LtvScatterPlot({ data, dark = true }: LtvScatterPlotProps) {
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
      const height = 280
      const margin = { top: 10, right: 20, bottom: 40, left: 60 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      svg.attr('width', width).attr('height', height)

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const x = scaleLinear().domain([15, 850]).range([0, innerWidth])
      const y = scaleLinear()
        .domain([0, Math.max(5000, max(data, (d) => d.lifetimeValue) ?? 5000)])
        .range([innerHeight, 0])

      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(axisBottom(x).ticks(5))
        .call((axis) => axis.select('.domain').attr('stroke', '#4B5563'))
        .selectAll('text')
        .attr('fill', axisColor)

      g.append('g')
        .call(axisLeft(y).ticks(5).tickFormat((v) => `$${Number(v) / 1000}k`))
        .call((axis) => axis.select('.domain').attr('stroke', '#4B5563'))
        .selectAll('text')
        .attr('fill', axisColor)

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 35)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .attr('font-size', '11px')
        .text('Order Value')

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .attr('font-size', '11px')
        .text('Lifetime Value')

      const tooltip = select(container)
        .append('div')
        .attr(
          'class',
          'pointer-events-none absolute hidden rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg',
        )

      g.selectAll<SVGCircleElement, CustomerLTV>('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(d.orderValue))
        .attr('cy', (d) => y(d.lifetimeValue))
        .attr('r', 4)
        .attr('fill', '#60A5FA')
        .attr('fill-opacity', 0)
        .attr('stroke', '#93C5FD')
        .style('cursor', 'pointer')
        .on('mouseenter', function (_event, d) {
          select(this).attr('r', 6)
          tooltip
            .html(
              `<strong>${d.customerId}</strong><br/>Order Value: $${d.orderValue}<br/>` +
                `Lifetime Value: $${d.lifetimeValue.toLocaleString()}<br/>Orders: ${d.orderCount}`,
            )
            .style('left', `${margin.left + x(d.orderValue) + 12}px`)
            .style('top', `${margin.top + y(d.lifetimeValue) - 12}px`)
            .classed('hidden', false)
        })
        .on('mouseleave', function () {
          select(this).attr('r', 4)
          tooltip.classed('hidden', true)
        })
        .transition()
        .duration(400)
        .delay((_, i) => Math.min(i * 2, 400))
        .attr('fill-opacity', 0.6)

      if (data.length >= 2) {
        const trend = regressionLinear<CustomerLTV>()
          .x((d) => d.orderValue)
          .y((d) => d.lifetimeValue)(data)

        const trendLine = line<[number, number]>()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))

        g.append('path')
          .datum(trend)
          .attr('d', trendLine)
          .attr('stroke', '#FBBF24')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
      }
    }

    render()

    const resizeObserver = new ResizeObserver(() => render())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      select(container).selectAll('.pointer-events-none').remove()
    }
  }, [data, dark])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Customer Lifetime Value
      </h3>
      <svg ref={svgRef} data-testid="chart-svg" className="w-full overflow-visible" />
    </div>
  )
}
