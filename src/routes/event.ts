import { Router } from 'express';
import { authenticate, authorize, isEventOwner } from '../middleware/auth';
import EventController from '../controllers/eventController';
import rateLimiter from '../middleware/rateLimiter';

const eventRouter = Router();

eventRouter.use(rateLimiter);
// attendee
eventRouter.get('/events', authenticate, EventController.getAllEvents);
eventRouter.get('/event-detail/:id', authenticate, EventController.getEventDetailById);

// organizer
eventRouter.post('/events', authenticate, authorize('organizer'), EventController.createEvent);
eventRouter.put('/events/:id', authenticate, authorize('organizer', 'admin'), isEventOwner, EventController.updateEvent);
eventRouter.delete('/events/:id', authenticate, authorize('organizer', 'admin'), isEventOwner, EventController.deleteEvent);

// admin
eventRouter.get('/admin/events', authenticate, authorize('admin'), EventController.getAllEventsForAdmin);
eventRouter.get('/admin/users', authenticate, authorize('admin'), EventController.getAllUsers);
eventRouter.patch('/admin/users/:email', authenticate, authorize('admin'), EventController.updateUser);
