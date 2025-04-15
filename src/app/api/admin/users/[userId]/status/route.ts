import { NextResponse } from 'next/server'
import User from '@/models/User'

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { status } = await request.json()
    
    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      { status },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    )
  }
} 