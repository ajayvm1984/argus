import { Request, Response, NextFunction } from 'express';

// Mock auth middleware - real implementation uses Keycloak JWT validation
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For dev: allow X-Tenant-ID header as simple auth
    const tenantId = req.headers['x-tenant-id'];
    if (tenantId) {
      (req as any).tenantId = tenantId;
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    // TODO: Validate JWT against Keycloak
    // const decoded = await validateKeycloakToken(token);
    // (req as any).user = decoded;
    (req as any).user = { sub: 'dev-user' };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
