const API_BASE_URL = 'http://localhost:3000';

export interface SubmitComplaintPayload {
  title: string;
  description: string;
  category?: string;
  categoryId: string; // Valid UUID
  latitude: number;
  longitude: number;
  address: string;
  priority?: string;
}

/**
 * Step 1: Hackathon Demo Login
 * Requests mock OTP and verifies it to store a valid JWT token
 */
export async function hackathonDemoLogin(): Promise<string> {
  const phone = '+919876543210';
  const otp = '123456';

  console.log('🔄 Initiating Hackathon Demo Login with phone:', phone);

  try {
    // 1. Request OTP
    const reqRes = await fetch(`${API_BASE_URL}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!reqRes.ok) {
      const errData = await reqRes.json().catch(() => ({}));
      console.error('❌ OTP Request failed:', errData);
      throw new Error(`OTP request failed with status ${reqRes.status}: ${JSON.stringify(errData)}`);
    }

    const reqData = await reqRes.json();
    console.log('✅ OTP requested successfully:', reqData);

    // 2. Verify OTP
    const verifyRes = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        otp,
        name: 'Demo Citizen',
        role: 'CITIZEN',
      }),
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error('❌ OTP Verification failed:', errData);
      throw new Error(`OTP verify failed with status ${verifyRes.status}: ${JSON.stringify(errData)}`);
    }

    const verifyData = await verifyRes.json();
    const token = verifyData.access_token;

    if (!token) {
      throw new Error('No access_token returned from /auth/otp/verify');
    }

    localStorage.setItem('token', token);
    console.log('🔑 JWT token saved to localStorage:', token.slice(0, 20) + '...');
    return token;
  } catch (err: any) {
    console.error('❌ hackathonDemoLogin error:', err);
    throw err;
  }
}

/**
 * Step 2: Submit Complaint to NestJS Backend
 */
export async function submitComplaintToBackend(payload: SubmitComplaintPayload): Promise<any> {
  let token = localStorage.getItem('token');

  // Check if token exists; if not, authenticate first
  if (!token) {
    console.log('ℹ️ No token found in localStorage, performing hackathonDemoLogin...');
    token = await hackathonDemoLogin();
  }

  console.log('🚀 Sending complaint submission to backend at', `${API_BASE_URL}/complaints`, payload);

  try {
    let res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // If unauthorized (token expired), re-login once and retry
    if (res.status === 401) {
      console.warn('⚠️ Token expired or unauthorized (401). Refreshing token via demo login...');
      token = await hackathonDemoLogin();
      res = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Step 3: Robust Error Logging for debugging 400 Validation Error or 401 Unauthorized
      console.error('❌ Backend Complaint Submission Failed!');
      console.error('HTTP Status:', res.status, res.statusText);
      console.error('Response Data:', resData);
      if (res.status === 400) {
        console.error('👉 400 Validation Error Details:', resData.message || resData);
      } else if (res.status === 401) {
        console.error('👉 401 Unauthorized Error Details:', resData.message || resData);
      }
      throw new Error(
        `Complaint submission failed (${res.status}): ${
          Array.isArray(resData.message) ? resData.message.join(', ') : resData.message || JSON.stringify(resData)
        }`,
      );
    }

    console.log('🎉 ✅ Complaint successfully saved to database via backend!', resData);
    return resData;
  } catch (error: any) {
    console.error('❌ Failed to submit complaint:', error);
    throw error;
  }
}

/**
 * Step 3: Fetch complaints submitted by current user (GET /complaints/mine with fallback to GET /complaints)
 */
export async function fetchMyComplaints(): Promise<any[]> {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      token = await hackathonDemoLogin();
    } catch {
      // Continue to fallback if demo login fails
    }
  }

  try {
    if (token) {
      const res = await fetch(`${API_BASE_URL}/complaints/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const mine = await res.json();
        if (Array.isArray(mine) && mine.length > 0) {
          return mine;
        }
      } else if (res.status === 401) {
        token = await hackathonDemoLogin();
        const retryRes = await fetch(`${API_BASE_URL}/complaints/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (retryRes.ok) {
          const mine = await retryRes.json();
          if (Array.isArray(mine) && mine.length > 0) return mine;
        }
      }
    }

    // Fallback: If /complaints/mine returned empty or failed, fetch all database complaints so data is never lost
    const all = await fetchAllComplaints();
    return Array.isArray(all) ? all : [];
  } catch (err) {
    console.warn('Failed to fetch my complaints from /complaints/mine, trying fallback:', err);
    try {
      const all = await fetchAllComplaints();
      return Array.isArray(all) ? all : [];
    } catch {
      return [];
    }
  }
}

/**
 * Step 4: Fetch all public complaints (GET /complaints)
 */
export async function fetchAllComplaints(): Promise<any[]> {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      token = await hackathonDemoLogin();
    } catch {
      // Continue even if login fails
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.warn('Could not fetch all complaints from backend, using fallback:', err);
    return [];
  }
}

/**
 * Step 5: Fetch single complaint details by ID or complaintNumber (GET /complaints/:id)
 */
export async function fetchComplaintById(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/complaints/${encodeURIComponent(id)}`);
    if (res.ok) {
      return await res.json();
    }
    // If direct lookup by id gave 404, search the full complaints list in case of ID / complaintNumber alias
    const all = await fetchAllComplaints();
    if (Array.isArray(all)) {
      const found = all.find(
        (c: any) =>
          c.id === id ||
          c.complaintNumber === id ||
          c.backendId === id ||
          (c.title && c.title.toLowerCase() === id.toLowerCase())
      );
      if (found) return found;
    }
    return null;
  } catch (err) {
    console.error(`Error fetching complaint ${id}:`, err);
    try {
      const all = await fetchAllComplaints();
      if (Array.isArray(all)) {
        return all.find((c: any) => c.id === id || c.complaintNumber === id) || null;
      }
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Step 6: Fetch University Lab matches for a complaint (GET /complaints/:id/matches)
 */
export async function fetchComplaintMatches(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/complaints/${encodeURIComponent(id)}/matches`);
    if (res.ok) {
      return await res.json();
    }
    console.warn(`Matches request failed with status: ${res.status}`);
    return null;
  } catch (err) {
    console.error(`Error fetching matches for complaint ${id}:`, err);
    return null;
  }
}

/**
 * Helper to map a backend Complaint DB model to frontend Challenge object
 */
export function mapBackendComplaintToChallenge(c: any): any {
  // Extract address lines if present
  const descLines = (c.description || '').split('\n');
  const cleanDesc = descLines.filter((l: string) => !l.startsWith('Address:')).join('\n').trim();
  const addressLine = descLines.find((l: string) => l.startsWith('Address:'))?.replace('Address:', '').trim() || 'Ranchi, Jharkhand';

  return {
    id: c.complaintNumber || c.id,
    backendId: c.id,
    complaintNumber: c.complaintNumber,
    title: c.title,
    description: cleanDesc || c.description,
    whoIsAffected: 'Local community and residents',
    durationExisted: 'Ongoing civic issue',
    category: c.category || 'Water and Sanitation',
    tags: c.extracted_skills || ['Civic Issue', 'Infrastructure'],
    sdgGoals: c.sdg_target ? [c.sdg_target] : [6],
    priority: (c.priority === 'HIGH' || c.priority === 'CRITICAL') ? 'High' : (c.priority === 'LOW' ? 'Low' : 'Medium'),
    status: c.status === 'SUBMITTED' ? 'Submitted' : (c.status === 'ASSIGNED' ? 'Assigned to University' : (c.status === 'IN_PROGRESS' ? 'In Progress' : (c.status === 'RESOLVED' ? 'Completed' : 'Under Validation'))),
    assignedUniversity: c.assignedUniversity || null,
    assignedUniversityId: c.assignedUniversityId || null,
    classification: c.classification || 'INNOVATION',
    sdg_target: c.sdg_target || 6,
    extracted_skills: Array.isArray(c.extracted_skills) ? c.extracted_skills : (typeof c.extracted_skills === 'string' ? JSON.parse(c.extracted_skills) : ['Civil Engineering', 'IoT']),
    location: {
      state: 'Jharkhand',
      district: 'Ranchi',
      address: addressLine,
      lat: c.latitude || 23.4346,
      lng: c.longitude || 85.3206,
    },
    evidence: [],
    impact: {
      affectedPeopleCount: 1200,
      affectedCommunity: 'Local residents & village blocks',
      severity: c.priority === 'HIGH' ? 'Severe' : 'Moderate',
      urgency: c.priority === 'HIGH' ? 'High' : 'Medium',
      frequency: 'Continuous',
      potentialBeneficiaries: '1200+ citizens',
    },
    privacy: {
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Phone',
      shareConsent: true,
      accuracyDeclaration: true,
    },
    submittedBy: {
      id: c.citizenId || 'USR-DEMO',
      name: c.citizen?.name || 'Citizen Reporter',
      phone: c.citizen?.phone || '+91 98765 43210',
      isAnonymous: false,
    },
    submittedAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '2026-09-22',
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : '2026-09-22',
    timeline: (c.history && c.history.length > 0)
      ? c.history.map((h: any) => ({
          status: 'Submitted',
          label: `Status: ${h.newStatus}`,
          timestamp: h.timestamp || c.createdAt,
          actor: h.changedBy?.name || 'Municipal Officer',
          actorRole: 'government',
          notes: `Updated status from ${h.previousStatus} to ${h.newStatus}`,
        }))
      : [
          {
            status: 'Submitted',
            label: 'Problem Submitted & AI Triaged',
            timestamp: c.createdAt || new Date().toISOString(),
            actor: 'Automated AI Triage Engine',
            actorRole: 'government',
            notes: `AI Classified as ${c.classification || 'INNOVATION'} with SDG target ${c.sdg_target || 6}`,
          },
        ],
    upvotes: 12,
    upvotedByUserIds: [],
    followersCount: 5,
    comments: [],
  };
}

/**
 * Step 7: Fetch all accredited universities (GET /universities)
 */
export async function fetchUniversities(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/universities`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch universities:', err);
    return [];
  }
}

/**
 * Step 8: Fetch University Inbox of incoming AI Innovation challenges (GET /universities/:universityId/inbox)
 */
export async function fetchUniversityInbox(universityId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/universities/${encodeURIComponent(universityId)}/inbox`);
    if (res.ok) {
      return await res.json();
    }
    console.warn(`Failed to fetch inbox, status: ${res.status}`);
    return [];
  } catch (err) {
    console.error(`Error fetching university inbox for ${universityId}:`, err);
    return [];
  }
}

/**
 * Step 9: Accept Project / Challenge for University Lab (POST /complaints/:id/accept)
 */
export async function acceptComplaintByUniversity(complaintId: string, universityId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/complaints/${encodeURIComponent(complaintId)}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ universityId }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to accept challenge (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.error(`Failed to accept challenge ${complaintId}:`, err);
    throw err;
  }
}

/**
 * Step 10: Fetch Industry Projects (GET /industry/projects)
 */
export async function fetchIndustryProjects(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/industry/projects`);
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.warn('Could not fetch industry projects from backend:', err);
    return [];
  }
}

