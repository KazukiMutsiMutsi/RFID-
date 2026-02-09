import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock search function
function searchStudents(query: string) {
  const locations = ["Main Gate", "Library", "Gym", "Cafeteria", "Science Lab", "Computer Lab"];
  const sections = ["A", "B", "C"];
  const names = [
    "John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", "James Wilson",
    "Olivia Martinez", "William Anderson", "Ava Taylor", "Robert Thomas", "Isabella Garcia",
  ];

  const results: any[] = [];
  const lowerQuery = query.toLowerCase();

  // Generate some matching results
  for (let i = 0; i < 5; i++) {
    const name = names[i % names.length];
    const grade = 7 + (i % 6);
    const studentId = `STU${grade}${String(i + 1).padStart(3, "0")}`;
    
    // Check if matches query
    if (
      name.toLowerCase().includes(lowerQuery) ||
      studentId.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        studentId,
        studentName: name,
        grade,
        section: sections[i % sections.length],
        currentLocation: locations[i % locations.length],
        lastSeen: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.2 ? "present" : "absent",
      });
    }
  }

  return results;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const results = searchStudents(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
