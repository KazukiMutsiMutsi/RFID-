import { NextRequest, NextResponse } from "next/server";
import { Prisma, type Tag as PrismaTag, TagStatus, TagType, OwnerType } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Tag = {
  id: string;
  uid: string;
  status: TagStatus;
  type: TagType;
  ownerId: string | null;
  ownerType: OwnerType | null;
  issuedAt: string | null;
  revokedAt: string | null;
  lastSeen: string | null;
};

function serializeTag(tag: PrismaTag): Tag {
  return {
    id: tag.id,
    uid: tag.uid,
    status: tag.status,
    type: tag.type,
    ownerId: tag.ownerId,
    ownerType: tag.ownerType,
    issuedAt: tag.issuedAt ? tag.issuedAt.toISOString() : null,
    revokedAt: tag.revokedAt ? tag.revokedAt.toISOString() : null,
    lastSeen: tag.lastSeen ? tag.lastSeen.toISOString() : null,
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = (url.searchParams.get("search") || "").toLowerCase();
  const status = url.searchParams.get("status") || "";
  const type = url.searchParams.get("type") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(5, parseInt(url.searchParams.get("pageSize") || "10", 10)));

  const where: Prisma.TagWhereInput = {};

  if (search) {
    where.OR = [
      { uid: { contains: search, mode: "insensitive" } },
      { ownerId: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status as TagStatus;
  if (type) where.type = type as TagType;

  const total = await prisma.tag.count({ where });
  const data = await prisma.tag.findMany({
    where,
    orderBy: { issuedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json(
    { data: data.map(serializeTag), page, pageSize, total },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = String(body?.uid || "").trim();
    const type = (body?.type as TagType) || "student";
    if (!uid) return NextResponse.json({ error: "uid is required" }, { status: 400 });
    const created = await prisma.tag.create({
      data: {
        uid,
        type,
        status: "unassigned",
        issuedAt: new Date(),
      },
    });
    return NextResponse.json({ tag: serializeTag(created) }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "uid already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
