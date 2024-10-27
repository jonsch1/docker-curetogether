"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from '@/components/ui/spinner'
interface Profile {
  id: string
  bio: string | null
  location: string | null
  website: string | null
  github: string | null
  twitter: string | null
  linkedin: string | null
  researchGate: string | null
  specialties: string | null
  organization: string | null
  position: string | null
  userId: string
  User: {
    name: string | null
    email: string
  }
}

export default function ProfilePage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
    researchGate: '',
    specialties: '',
    organization: '',
    position: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`/api/profile/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditedProfile({
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          github: data.github || '',
          twitter: data.twitter || '',
          linkedin: data.linkedin || '',
          researchGate: data.researchGate || '',
          specialties: data.specialties || '',
          organization: data.organization || '',
          position: data.position || '',
        })
      }
    }
    fetchProfile()
  }, [id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    const response = await fetch(`/api/profile/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedProfile),
    })

    if (response.ok) {
      setProfile(prev => prev ? { ...prev, ...editedProfile } : null)
      setIsEditing(false)
    }
  }

  if (!profile) return (<div className="absolute inset-0 flex items-center justify-center">
  <LoadingSpinner size={40} />
</div>)

  const isOwnProfile = session?.user?.id === profile.userId

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://avatar.vercel.sh/${profile?.User.email}`} alt={profile?.User.name || 'User'} />
              <AvatarFallback>{profile?.User.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{profile?.User.name}</h1>
              <p className="text-muted-foreground">{profile?.User.email}</p>
              {profile?.position && profile?.organization && (
                <p className="text-sm text-muted-foreground">
                  {profile.position} at {profile.organization}
                </p>
              )}
              {profile?.location && (
                <p className="text-sm text-muted-foreground">📍 {profile.location}</p>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <Textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="mb-2"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Professional Info</h2>
                  <Input
                    placeholder="Position"
                    value={editedProfile.position}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, position: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Organization"
                    value={editedProfile.organization}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, organization: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Location"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Specialties"
                    value={editedProfile.specialties}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, specialties: e.target.value }))}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Links</h2>
                  <Input
                    placeholder="Website"
                    value={editedProfile.website}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    placeholder="GitHub"
                    value={editedProfile.github}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, github: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    placeholder="LinkedIn"
                    value={editedProfile.linkedin}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    placeholder="ResearchGate"
                    value={editedProfile.researchGate}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, researchGate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <p>{profile?.bio || 'No bio available.'}</p>
              </div>

              {profile?.specialties && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Specialties</h2>
                  <p>{profile.specialties}</p>
                </div>
              )}

              {(profile?.website || profile?.github || profile?.linkedin || profile?.researchGate) && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Links</h2>
                  <div className="flex gap-4">
                    {profile?.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Website
                      </a>
                    )}
                    {profile?.github && (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        GitHub
                      </a>
                    )}
                    {profile?.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {profile?.researchGate && (
                      <a href={profile.researchGate} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        ResearchGate
                      </a>
                    )}
                  </div>
                </div>
              )}

              {isOwnProfile && (
                <Button onClick={handleEdit} className="mt-4">Edit Profile</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
