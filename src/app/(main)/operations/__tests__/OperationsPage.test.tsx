import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperationsPage from '../page';

const push = jest.fn();
let currentParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/operations',
  useSearchParams: () => currentParams,
}));

jest.mock('@/data/api/ApiHandler', () => ({
  __esModule: true,
  default: { operations: {} },
}));

function renderAt(search: string) {
  currentParams = new URLSearchParams(search);
  return render(<OperationsPage />);
}

beforeEach(() => {
  push.mockClear();
});

describe('OperationsPage', () => {
  it('shows the three operations sections with Facility Management selected by default', () => {
    renderAt('');

    expect(screen.getByRole('heading', { name: 'Operations' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Facility Management' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Processing' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(screen.getByRole('tab', { name: 'Logistics' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('renders the facility counters, cohorts and allocations', () => {
    renderAt('');

    expect(screen.getByText('Total Greenhouses')).toBeInTheDocument();
    expect(screen.getByText('33')).toBeInTheDocument();
    expect(screen.getByText('Shortlet Accommodation')).toBeInTheDocument();

    expect(screen.getByText('Cohort 12')).toBeInTheDocument();

    // Staff Block A: 15 units, 12 allocated -> 3 unallocated
    const blockA = screen.getByLabelText('Edit Staff Block A').closest('div') as HTMLElement;
    expect(within(blockA).getByText('Staff Block A')).toBeInTheDocument();
    expect(within(blockA).getByText('Total: 15 units')).toBeInTheDocument();
    expect(within(blockA).getByText('Allocated: 12')).toBeInTheDocument();
    expect(within(blockA).getByText('Unallocated: 3')).toBeInTheDocument();

    // Admin Building: 20 offices, 15 allocated -> 5 unallocated
    const adminBuilding = screen
      .getByLabelText('Edit Admin Building')
      .closest('div') as HTMLElement;
    expect(within(adminBuilding).getByText('Total: 20 offices')).toBeInTheDocument();
    expect(within(adminBuilding).getByText('Unallocated: 5')).toBeInTheDocument();
  });

  it('drops the sub-tab when a different section is selected', async () => {
    const user = userEvent.setup({ delay: null });
    renderAt('tab=processing&sub=machine-usage-logs');

    await user.click(screen.getByRole('tab', { name: 'Logistics' }));

    expect(push).toHaveBeenCalledWith('/operations?tab=logistics', { scroll: false });
  });

  it('shows the empty batch scheduling table on the Processing tab', () => {
    renderAt('tab=processing');

    expect(screen.getByRole('heading', { name: 'Batch Scheduling' })).toBeInTheDocument();
    expect(screen.getByText('No batches scheduled yet.')).toBeInTheDocument();

    const header = screen.getByRole('table');
    expect(within(header).getByText('Qty (kg)')).toBeInTheDocument();
    expect(within(header).getByText('Sched. Start')).toBeInTheDocument();
  });

  it('shows the empty vehicle tracking table on the Logistics tab', () => {
    renderAt('tab=logistics');

    expect(screen.getByRole('heading', { name: 'Vehicle Tracking Logs' })).toBeInTheDocument();
    expect(screen.getByText('No tracking logs yet.')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getByText('Distance (km)')).toBeInTheDocument();
  });

  it('opens the Add Vehicle Tracking Log modal from the URL', () => {
    renderAt('tab=logistics&vehicle_tracking_modal=true');

    const dialog = screen.getByRole('dialog', { name: 'Add Vehicle Tracking Log' });
    expect(within(dialog).getByText('Enter trip details')).toBeInTheDocument();
    expect(within(dialog).getByPlaceholderText('Vehicle name / plate no.')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Add Log' })).toBeInTheDocument();
  });

  it('opens the Schedule New Batch modal from the URL', () => {
    renderAt('tab=processing&batch_modal=true');

    const dialog = screen.getByRole('dialog', { name: 'Schedule New Batch' });
    expect(within(dialog).getByPlaceholderText('e.g. BATCH-001')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Schedule Batch' })).toBeInTheDocument();
  });
});
