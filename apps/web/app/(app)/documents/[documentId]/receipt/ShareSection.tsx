'use client';

import { useState, useEffect } from "react";

interface ShareLink {
  id: string;
  token: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  revokedAt: string | null;
}

interface Props {
  receiptId: string;
}

export function ShareSection({ receiptId }: Props) {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [expiresDays, setExpiresDays] = useState<string>("");

  useEffect(() => {
    fetchLinks();
  }, [receiptId]);

  async function fetchLinks() {
    const res = await fetch(`/api/share/create?receiptId=${receiptId}`);
    if (res.ok) {
      const data = await res.json();
      setLinks(data.links || []);
    }
  }

  async function createLink() {
    setLoading(true);
    const expiresInDays = expiresDays ? parseInt(expiresDays) : undefined;
    const res = await fetch("/api/share/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiptId, expiresInDays }),
    });
    setLoading(false);
    setShowCreate(false);
    setExpiresDays("");
    if (res.ok) {
      const data = await res.json();
      setLinks((prev) => [
        { id: "new", token: data.token, status: "ACTIVE", expiresAt: data.expiresAt, createdAt: new Date().toISOString(), revokedAt: null },
        ...prev,
      ]);
      setCopiedId("new");
      const url = `${window.location.origin}/share/${data.token}`;
      await navigator.clipboard.writeText(url);
      setTimeout(() => setCopiedId(null), 2000);

      // Track share link creation (analytics scaffold)
      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics] share_link_created", { receiptId });
      }
    }
  }

  async function revokeLink(token: string) {
    const res = await fetch("/api/share/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setLinks((prev) => prev.map((l) => l.token === token ? { ...l, status: "REVOKED", revokedAt: new Date().toISOString() } : l));
    }
  }

  async function copyLink(token: string) {
    const url = `${window.location.origin}/share/${token}`;
    await navigator.clipboard.writeText(url);
    const link = links.find((l) => l.token === token);
    setCopiedId(link?.id || token);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const activeLinks = links.filter((l) => l.status === "ACTIVE");

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Share with Instructor</h2>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700"
          >
            + Create Share Link
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-gray-50 border rounded p-4 mb-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Link expires in (days) — leave blank for no expiry
            </label>
            <input
              type="number"
              value={expiresDays}
              onChange={(e) => setExpiresDays(e.target.value)}
              placeholder="No expiry"
              className="w-full px-3 py-2 border rounded text-sm"
              min="1"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={createLink}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create & Copy Link"}
            </button>
            <button
              onClick={() => { setShowCreate(false); setExpiresDays(""); }}
              className="px-4 py-2 border text-xs rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeLinks.length === 0 && !showCreate && (
        <p className="text-gray-400 text-sm">
          No active share links. Create one to share this report with your instructor before or after submission.
        </p>
      )}

      {activeLinks.length > 0 && (
        <div className="space-y-2">
          {activeLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 flex-1 truncate font-mono text-xs">
                /share/{link.token.slice(0, 12)}...
              </span>
              {link.expiresAt && (
                <span className="text-gray-400 text-xs">
                  Expires {new Date(link.expiresAt).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={() => copyLink(link.token)}
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
              >
                {copiedId === link.id ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => revokeLink(link.token)}
                className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      {links.filter((l) => l.status === "REVOKED").length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-400 mb-1">Revoked links</p>
          {links.filter((l) => l.status === "REVOKED").map((link) => (
            <div key={link.id} className="flex items-center gap-2 text-sm text-gray-400">
              <span className="flex-1 truncate font-mono text-xs">
                /share/{link.token.slice(0, 12)}...
              </span>
              <span className="text-xs">Revoked {link.revokedAt ? new Date(link.revokedAt).toLocaleDateString() : ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
