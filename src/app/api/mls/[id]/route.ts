// Other methods at this endpoint
import { NextRequest, NextResponse } from "next/server";
import { getPropertyByID } from "@/lib/services/propertyService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  
  const params = await context.params;

  const listingID = params.id;

  const property = await getPropertyByID(listingID);

  return NextResponse.json(property);

}

// Use IDs to fetch specific properties
// Call function within PropertyService to fetch properties with IDs, return those to front end for display

