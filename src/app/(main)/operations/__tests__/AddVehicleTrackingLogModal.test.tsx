import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddVehicleTrackingLogModal from '../_components/AddVehicleTrackingLogModal';

function setup(open = true) {
  const onCreate = jest.fn();
  const onClose = jest.fn();
  render(
    <AddVehicleTrackingLogModal open={open} onCreate={onCreate} onClose={onClose} />
  );
  return { onCreate, onClose };
}

describe('AddVehicleTrackingLogModal', () => {
  it('renders nothing when closed', () => {
    setup(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('blocks submission and reports the required fields', async () => {
    const user = userEvent.setup({ delay: null });
    const { onCreate } = setup();

    await user.click(screen.getByRole('button', { name: 'Add Log' }));

    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByText('Date is required')).toBeInTheDocument();
    expect(screen.getByText('Vehicle is required')).toBeInTheDocument();
    expect(screen.getByText('Driver name is required')).toBeInTheDocument();
  });

  it('submits the trip with optional fields omitted', async () => {
    const user = userEvent.setup({ delay: null });
    const { onCreate } = setup();

    await user.type(screen.getByLabelText(/^Date/), '2026-09-07');
    await user.type(screen.getByLabelText(/^Vehicle/), 'Hilux ABC-123');
    await user.type(screen.getByLabelText(/^Driver Name/), 'Musa Bello');
    await user.clear(screen.getByLabelText(/^Distance \(km\)/));
    await user.type(screen.getByLabelText(/^Distance \(km\)/), '42');

    await user.click(screen.getByRole('button', { name: 'Add Log' }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith({
      date: '2026-09-07',
      vehicle: 'Hilux ABC-123',
      driver: 'Musa Bello',
      destination: undefined,
      departureTime: undefined,
      returnTime: undefined,
      distanceKm: 42,
      purpose: undefined,
      status: 'in_transit',
      remarks: undefined,
    });
  });

  it('closes from the Cancel button', async () => {
    const user = userEvent.setup({ delay: null });
    const { onClose } = setup();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });
});
