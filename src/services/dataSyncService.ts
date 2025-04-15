'use client';

interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
}

interface TrainerStats {
  totalTrainers: number;
  activeTrainers: number;
  trainersWithAppointments: number;
}

interface Stats {
  memberStats: MemberStats;
  trainerStats: TrainerStats;
}

export class DataSyncService {
  // Get all statistics
  static async getStats(): Promise<Stats> {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch statistics');
    }
  }

  // Update member status
  static async updateMemberStatus(userId: string, status: 'ACTIVE' | 'INACTIVE') {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update member status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating member status:', error);
      throw new Error('Failed to update member status');
    }
  }

  // Update trainer status
  static async updateTrainerStatus(userId: string, status: 'ACTIVE' | 'INACTIVE') {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update trainer status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating trainer status:', error);
      throw new Error('Failed to update trainer status');
    }
  }
} 