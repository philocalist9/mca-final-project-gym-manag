import { NextResponse } from 'next/server'
import User from '@/models/User'
import { UserRole } from '@/models/User'

export async function GET() {
  try {
    const [memberStats, trainerStats] = await Promise.all([
      // Member statistics
      Promise.all([
        User.countDocuments({ role: UserRole.MEMBER }),
        User.countDocuments({ 
          role: UserRole.MEMBER,
          status: 'ACTIVE'
        }),
        User.countDocuments({
          role: UserRole.MEMBER,
          createdAt: {
            $gte: new Date(new Date().setDate(1)), // First day of current month
            $lte: new Date()
          }
        })
      ]),
      // Trainer statistics
      Promise.all([
        User.countDocuments({ role: UserRole.TRAINER }),
        User.countDocuments({ 
          role: UserRole.TRAINER,
          status: 'ACTIVE'
        }),
        User.countDocuments({
          role: UserRole.TRAINER,
          'appointments.date': {
            $gte: new Date()
          }
        })
      ])
    ])

    return NextResponse.json({
      memberStats: {
        totalMembers: memberStats[0],
        activeMembers: memberStats[1],
        newMembersThisMonth: memberStats[2]
      },
      trainerStats: {
        totalTrainers: trainerStats[0],
        activeTrainers: trainerStats[1],
        trainersWithAppointments: trainerStats[2]
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    )
  }
} 