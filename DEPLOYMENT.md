# Deployment Report

## Project Information
- **Project Name**: NewCastle HBAM Bumpout Designer
- **Repository**: https://github.com/GonzVerse/newcastle-hbeam-designer
- **Deployment Platform**: Vercel
- **Deployment Date**: March 28, 2026

## Live URLs
- **Production URL**: https://newcastle-hbeam-designer.vercel.app
- **Deployment URL**: https://newcastle-hbeam-designer-ddby09pq6-gonzalos-projects-45d94671.vercel.app
- **Inspector URL**: https://vercel.com/gonzalos-projects-45d94671/newcastle-hbeam-designer/J6wqtqrs9DA9bx63Lg2Ysa6p6ePB

## Build Information
- **Status**: ✅ Success
- **Build Time**: 40 seconds
- **Build Region**: Washington, D.C., USA (East) - iad1
- **Build Machine**: 2 cores, 8 GB RAM
- **Next.js Version**: 16.2.1
- **Deployment ID**: dpl_J6wqtqrs9DA9bx63Lg2Ysa6p6ePB

## Build Stages
1. **Dependencies Installation**: 14s (474 packages)
2. **TypeScript Compilation**: 3.8s (no errors)
3. **Next.js Build**: 4.8s (successful with Turbopack)
4. **Static Page Generation**: 130ms (5 pages)
5. **Output Deployment**: 25s
6. **Total Build Time**: ~40s

## Routes Deployed
- `/` - Static homepage with input form
- `/_not-found` - 404 page
- `/api/design` - Dynamic API endpoint for HBAM calculations

## Features Deployed
### Backend API
- POST `/api/design` endpoint
- Structural calculations for:
  - Box beams (single/double)
  - Ledger members
  - H-beams
- Input validation with error handling
- Demand-to-capacity ratio (DCR) calculations

### Frontend UI
- Touch-friendly input form for field workers
- Large, clear input fields with units
- Plain English labels and helper text
- Real-time validation
- Pass/fail results display
- Detailed structural checks table
- Color-coded visual feedback
- Mobile-responsive design

## Performance Metrics
- **Build Status**: No errors or warnings
- **TypeScript**: All type checks passed
- **Static Generation**: 5/5 pages successfully generated
- **Bundle Size**: Optimized production build

## Team Access
- **Vercel Team**: Gonzalo's projects
- **Team ID**: team_A9ll6ggTuWKx0fG9GCRjsoFl

## Next Steps
1. Test the live application at https://newcastle-hbeam-designer.vercel.app
2. Verify all API endpoints are working correctly
3. Run integration tests against the production deployment
4. Monitor deployment logs and analytics in Vercel dashboard

## Notes
- GitHub repository linked to Vercel for automatic deployments
- Future pushes to main branch will automatically trigger new deployments
- Previous build caches not available (first deployment)
- Vercel CLI v50.37.1 used for deployment
