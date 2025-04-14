import cron from 'node-cron';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';
import { MembershipStatus } from '@/models/Client';
import { sendEmail, EmailTemplate } from './email';

// Check memberships that are about to expire (7 days in advance)
export const checkMembershipRenewals = async () => {
  try {
    await dbConnect();

    // Get current date
    const now = new Date();
    
    // Get date 7 days from now
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    
    // Get date 1 day from now (for imminent expiry)
    const oneDayLater = new Date();
    oneDayLater.setDate(now.getDate() + 1);
    
    // Find all active memberships that will expire in the next 7 days
    const clientsToNotify = await Client.find({
      'membership.status': MembershipStatus.ACTIVE,
      'membership.endDate': {
        $gte: now,
        $lte: sevenDaysLater
      }
    });
    
    console.log(`Found ${clientsToNotify.length} memberships expiring in the next 7 days`);
    
    // Send renewal notifications
    for (const client of clientsToNotify) {
      // Calculate days until expiry
      const daysUntilExpiry = Math.ceil(
        (new Date(client.membership.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Only send notifications for clients who haven't been notified
      // or those who need an imminent expiry reminder (1 day)
      if (!client.membership.lastRenewalNotification || 
          (daysUntilExpiry <= 1 && client.membership.lastRenewalNotification <= oneDayLater)) {
        
        // Send email notification
        const emailSent = await sendEmail(
          client.email,
          EmailTemplate.MEMBERSHIP_RENEWAL,
          {
            clientName: client.name,
            endDate: client.membership.endDate,
            planType: client.membership.plan
          }
        );
        
        if (emailSent) {
          // Update last notification date
          await Client.findByIdAndUpdate(client._id, {
            'membership.lastRenewalNotification': now
          });
          
          console.log(`Sent renewal notification to ${client.name} (${client.email})`);
        }
      }
    }
    
    // Find expired memberships and update their status
    const expiredClients = await Client.find({
      'membership.status': MembershipStatus.ACTIVE,
      'membership.endDate': { $lt: now }
    });
    
    console.log(`Found ${expiredClients.length} expired memberships`);
    
    // Update expired memberships
    for (const client of expiredClients) {
      await Client.findByIdAndUpdate(client._id, {
        'membership.status': MembershipStatus.EXPIRED
      });
      
      console.log(`Updated ${client.name}'s membership status to EXPIRED`);
    }
    
    console.log('Membership renewal check completed');
  } catch (error) {
    console.error('Error checking membership renewals:', error);
  }
};

// Schedule the membership renewal check to run daily at midnight
export const scheduleMembershipRenewalChecks = () => {
  // Run at midnight every day (0 0 * * *)
  cron.schedule('0 0 * * *', checkMembershipRenewals);
  console.log('Scheduled membership renewal checks');
};

// Run all background jobs
export const startBackgroundJobs = () => {
  scheduleMembershipRenewalChecks();
  console.log('Started all background jobs');
}; 