'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, MapPin, Link as LinkIcon, 
  Edit, Camera, Github, Twitter, Linkedin, 
  ChevronRight, Activity, Star, BookOpen,
  Settings, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useSession } from 'next-auth/react';

// Mock data for the profile
const userData = {
  name: "Alex Johnson",
  username: "@alexjohnson",
  role: "Senior Product Designer",
  bio: "Passionate about creating beautiful and functional user experiences. Working at the intersection of design and technology to solve complex problems with elegant solutions.",
  location: "San Francisco, CA",
  website: "alexjohnson.design",
  joinDate: "Joined January 2020",
  following: 245,
  followers: 1203,
  email: "alex@example.com",
  skills: [
    { name: "UI Design", level: 95 },
    { name: "UX Research", level: 85 },
    { name: "Prototyping", level: 90 },
    { name: "Figma", level: 98 },
    { name: "Adobe Creative Suite", level: 80 },
  ],
  stats: [
    { label: "Projects", value: 48, icon: BookOpen },
    { label: "Contributions", value: 153, icon: Activity },
    { label: "Achievements", value: 12, icon: Star },
  ],
  recentProjects: [
    { id: 1, title: "Finance Dashboard Redesign", description: "Complete redesign of the main dashboard for a fintech app", date: "2 weeks ago", progress: 85 },
    { id: 2, title: "E-commerce Mobile App", description: "UX research and design for native mobile shopping experience", date: "1 month ago", progress: 100 },
    { id: 3, title: "Healthcare Patient Portal", description: "Accessible interface for patients to manage their healthcare", date: "2 months ago", progress: 70 },
  ]
};

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession()
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="container mx-auto p-4 py-8 max-w-6xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="relative mb-8">
        {/* Cover Image */}
        <motion.div 
          className="h-48 md:h-64 rounded-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="https://media.gettyimages.com/id/94637696/photo/japan-the-headquarters-of-denso-corp-stand-in-aichi-prefecture-japan-on-thursday-june-7-2007.jpg?s=612x612&w=0&k=20&c=N3WybrYN-KvKzhS6l_4-dzNCFPIp6jMf_e_5xeB5Bws=" 
            alt="Profile Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Floating particles - có thể giữ lại hoặc xóa tùy bạn muốn */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 50 + 20}px`,
                height: `${Math.random() * 50 + 20}px`,
              }}
              animate={{ 
                y: [0, Math.random() * 30 - 15],
                x: [0, Math.random() * 30 - 15],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
          
          <Button 
            size="sm" 
            variant="secondary" 
            className="absolute right-4 bottom-4 bg-background/80 backdrop-blur-sm"
          >
            <Camera className="mr-2 h-4 w-4" />
            Change Cover
          </Button>
        </motion.div>
        
        {/* Profile Picture and Basic Info */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 px-4 md:px-6 relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background rounded-full">
              <AvatarImage src="https://i.pravatar.cc/300" alt="Alex Johnson" />
              <AvatarFallback className="text-2xl bg-primary/10">AJ</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white h-6 w-6" />
            </div>
          </motion.div>
          
          <div className="md:ml-6 mt-4 md:mt-0 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div>
                <motion.h1 
                  className="text-2xl md:text-3xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {session?.user?.Username}
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {session?.user?.Username} · {"Admin"}
                </motion.p>
              </div>
              
              <div className="md:ml-auto flex gap-2 mt-2 md:mt-0">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
                <Button size="sm">
                  Message
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Bio and Info */}
        <motion.div 
          className="md:col-span-1 space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Bio Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{userData.bio}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{userData.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-primary underline">{userData.website}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{userData.joinDate}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-center">
                  <p className="font-medium">{userData.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-medium">{userData.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Skills Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Social Links */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Social</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Right Column - Tabs and Content */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {userData.stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className="p-3 rounded-full bg-primary/10 mb-4">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-3xl font-bold">{stat.value}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your most recent design projects</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <motion.div 
                    className="space-y-1"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {userData.recentProjects.map((project, index) => (
                      <motion.div 
                        key={project.id}
                        variants={item}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                        className="p-4 rounded-md"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Badge variant={project.progress === 100 ? "default" : "outline"}>
                              {project.progress === 100 ? "Completed" : "In Progress"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{project.date}</span>
                          </div>
                          <div className="w-24">
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button variant="outline" className="w-full">View All Projects</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>All Projects</CardTitle>
                  <CardDescription>Browse through all your design projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your projects content would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your activity feed would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your settings options would go here...</p>
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </Button>
                  <Button variant="destructive" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}