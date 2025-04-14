import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HealthMetric from '@/models/HealthMetric';
import Client from '@/models/Client';
import { getServerUser } from '@/utils/auth';
import { UserRole } from '@/models/User';
import mongoose from 'mongoose';

// GET /api/health?clientId=xyz
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    
    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json({ message: 'Valid client ID is required' }, { status: 400 });
    }

    // Check if client exists and if user has access
    const client = await Client.findById(clientId);
    
    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization for trainers
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Get health metrics for the client
    const healthMetrics = await HealthMetric.find({ client: clientId })
      .sort({ date: -1 });

    return NextResponse.json(healthMetrics);
  } catch (error: any) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/health
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    
    // Validate client ID
    if (!body.client || !mongoose.Types.ObjectId.isValid(body.client)) {
      return NextResponse.json({ message: 'Valid client ID is required' }, { status: 400 });
    }

    // Check if client exists and if user has access
    const client = await Client.findById(body.client);
    
    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Check authorization for trainers
    if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Create a new health metric
    const newHealthMetric = new HealthMetric({
      ...body,
      createdBy: user.id
    });
    
    await newHealthMetric.save();
    
    // Update client's healthMetrics array
    await Client.findByIdAndUpdate(body.client, {
      $push: { healthMetrics: newHealthMetric._id }
    });
    
    return NextResponse.json(newHealthMetric, { status: 201 });
  } catch (error: any) {
    console.error('Error creating health metric:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
} 