import { NextRequest, NextResponse } from 'next/server';
import { BumpoutInputs } from '@/lib/types';
import { designBumpout } from '@/lib/calculations';
import { validateInputs } from '@/lib/validation';

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // Basic type guard — ensure required numeric fields are present
  const requiredFields: (keyof BumpoutInputs)[] = [
    'p_psf', 'a_ft', 'b_ft', 'L_ft', 'W_ft', 'S_ft',
  ];

  const bodyObj = body as Record<string, unknown>;
  const missingFields = requiredFields.filter(
    (f) => bodyObj[f] === undefined || typeof bodyObj[f] !== 'number'
  );

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing or invalid fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  const inputs: BumpoutInputs = {
    p_psf: bodyObj.p_psf as number,
    a_ft: bodyObj.a_ft as number,
    b_ft: bodyObj.b_ft as number,
    L_ft: bodyObj.L_ft as number,
    W_ft: bodyObj.W_ft as number,
    S_ft: bodyObj.S_ft as number,
    ...(typeof bodyObj.Va_connection === 'number'
      ? { Va_connection: bodyObj.Va_connection }
      : {}),
  };

  // Run validation — hard errors return 422
  const { errors } = validateInputs(inputs);
  if (errors.length > 0) {
    return NextResponse.json(
      { errors },
      { status: 422 }
    );
  }

  const result = designBumpout(inputs);

  return NextResponse.json(result, { status: 200 });
}
