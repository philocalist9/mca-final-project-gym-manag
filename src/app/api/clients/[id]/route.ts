import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';
import { getServerUser } from '@/utils/auth';
import { UserRole } from '@/models/User';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/clients/[id]
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
      return NextResponse.json({ message: 'Invalid client ID' }, { status: 400 });
    }

    // Find the client
    const client = await Client.findById(id)
      .populate('healthMetrics', 'date weight height bmi bodyFatPercentage')
      .populate('assignedWorkoutPlan', 'name goal level')
      .populate('assignedDietPlan', 'name goal caloriesPerDay');

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

// PUT /api/clients/[id]
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
      return NextResponse.json({ message: 'Invalid client ID' }, { status: 400 });
    }

    // Find the client first to check authorization
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update the client
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedClient);
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

// DELETE /api/clients/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only gym owners and admins can delete clients
    if (user.role === UserRole.TRAINER) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid client ID' }, { status: 400 });
    }

    // Find the client
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Delete the client
    await Client.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
} 