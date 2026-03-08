import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Loader2, Play, Shield, BookOpen, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleRedirect: Record<string, string> = {
  admin: "/",
  faculty: "/faculty",
  student: "/student/events",
};

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [loading, setLoading] = useState(false);
  const { login, signup, loginDemo } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup({ name, email, password, role });
        navigate(roleRedirect[role]);
      } else {
        await login({ email, password });
        // Role redirect happens after login sets user
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          navigate(roleRedirect[parsed.role] || "/");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (demoRole: "admin" | "faculty" | "student") => {
    loginDemo(demoRole);
    navigate(roleRedirect[demoRole]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto p-3 rounded-xl bg-gradient-primary w-fit">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-bold">College Clubs Management</CardTitle>
          <CardDescription>
            {isSignup ? "Create your account" : "Sign in to your dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as "student" | "faculty")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@college.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary border-0 hover:opacity-90" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              try demo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button type="button" variant="outline" className="gap-1.5 text-xs" onClick={() => handleDemo("admin")}>
              <Shield className="h-3.5 w-3.5" /> Admin
            </Button>
            <Button type="button" variant="outline" className="gap-1.5 text-xs" onClick={() => handleDemo("faculty")}>
              <BookOpen className="h-3.5 w-3.5" /> Faculty
            </Button>
            <Button type="button" variant="outline" className="gap-1.5 text-xs" onClick={() => handleDemo("student")}>
              <Users className="h-3.5 w-3.5" /> Student
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
