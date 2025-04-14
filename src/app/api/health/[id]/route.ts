import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HealthMetric from '@/models/HealthMetric';
import Client from '@/models/Client';
import { getServerUser } from '@/utils/auth';
import { UserRole } from '@/models/User';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/health/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid health metric ID' }, { status: 400 });
    }

    // Find the health metric
    const healthMetric = await HealthMetric.findById(id);

    if (!healthMetric) {
      return NextResponse.json({ message: 'Health metric not found' }, { status: 404 });
    }

    // Check if user has access to this client's data
    const client = await Client.findById(healthMetric.client);

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization for trainers
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(healthMetric);
  } catch (error: any) {
    console.error('Error fetching health metric:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

// PUT /api/health/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const updates = await req.json();

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid health metric ID' }, { status: 400 });
    }

    // Find the health metric first
    const healthMetric = await HealthMetric.findById(id);

    if (!healthMetric) {
      return NextResponse.json({ message: 'Health metric not found' }, { status: 404 });
    }

    // Check if user has access to this client's data
    const client = await Client.findById(healthMetric.client);

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization for trainers
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update the health metric
    const updatedHealthMetric = await HealthMetric.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedHealthMetric);
  } catch (error: any) {
    console.error('Error updating health metric:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

// DELETE /api/health/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid health metric ID' }, { status: 400 });
    }

    // Find the health metric
    const healthMetric = await HealthMetric.findById(id);

    if (!healthMetric) {
      return NextResponse.json({ message: 'Health metric not found' }, { status: 404 });
    }

    // Check if user has access to this client's data
    const client = await Client.findById(healthMetric.client);

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization for trainers
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Delete the health metric
    await HealthMetric.findByIdAndDelete(id);

    // Remove the health metric from client's healthMetrics array
    await Client.findByIdAndUpdate(healthMetric.client, {
      $pull: { healthMetrics: id }
    });

    return NextResponse.json({ message: 'Health metric deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting health metric:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
} 