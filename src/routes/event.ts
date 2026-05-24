import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import EventController from '../controllers/eventController';
import { rateLimiter } from '../middleware/rateLimiter';
import { isEventOwner } from '../middleware/eventCheck';

const eventRouter = Router();

eventRouter.use(rateLimiter);
// public
eventRouter.get('/events', authenticate, EventController.getAllEvents);
eventRouter.get('/events/:id', authenticate, EventController.getEventDetailById);

//organizer atmin
eventRouter.post('/events', authenticate, authorize('organizer'), EventController.createEvent);
eventRouter.put('/events/:id', authenticate, authorize('organizer', 'admin'), isEventOwner, EventController.updateEvent);
eventRouter.delete('/events/:id', authenticate, authorize('organizer', 'admin'), isEventOwner, EventController.deleteEvent);
eventRouter.patch('/events/:id/publish', authenticate, authorize('organizer'), isEventOwner, EventController.publishEvent); 

//atmin
eventRouter.get('/admin/events', authenticate, authorize('admin'), EventController.getAllEvents);
eventRouter.put('/admin/events/:id', authenticate, authorize('admin'), EventController.updateEvent);       
eventRouter.delete('/admin/events/:id', authenticate, authorize('admin'), EventController.deleteEvent);   
eventRouter.get('/admin/users', authenticate, authorize('admin'), EventController.getAllUsers);
eventRouter.patch('/admin/users/:email', authenticate, authorize('admin'), EventController.updateUser);

export default eventRouter;