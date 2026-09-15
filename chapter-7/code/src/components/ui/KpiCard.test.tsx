import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DollarSign } from 'lucide-react'
import { KpiCard } from './KpiCard'

const icon = <DollarSign data-testid="icon" />

describe('KpiCard', () => {
  it('renders the title and value', () => {
    render(<KpiCard title="Total Revenue" value="$1,000" change={5} icon={icon} />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
  })

  it('shows a green badge when change > 0', () => {
    render(<KpiCard title="Total Revenue" value="$1,000" change={5} icon={icon} />)
    expect(screen.getByText('5.0%').closest('span')).toHaveClass('text-green-700')
  })

  it('shows a red badge when change < 0', () => {
    render(<KpiCard title="Total Revenue" value="$1,000" change={-5} icon={icon} />)
    expect(screen.getByText('5.0%').closest('span')).toHaveClass('text-red-700')
  })

  it('shows loading skeleton when loading=true (no title/value visible)', () => {
    render(<KpiCard title="Total Revenue" value="$1,000" change={5} icon={icon} loading />)
    expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument()
    expect(screen.queryByText('$1,000')).not.toBeInTheDocument()
    expect(screen.getByTestId('kpi-card-skeleton')).toBeInTheDocument()
  })

  it('has correct aria-label combining title and value', () => {
    render(<KpiCard title="Total Revenue" value="$1,000" change={5} icon={icon} />)
    expect(screen.getByRole('region')).toHaveAttribute(
      'aria-label',
      'Total Revenue: $1,000',
    )
  })
})
