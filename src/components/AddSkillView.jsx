import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddSkillView = ({ onAddSkill }) => {
  const [newSkillName, setNewSkillName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    onAddSkill(newSkillName);
    setNewSkillName("");
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Add New Skill</h2>
          <p className="text-muted-foreground">
            Start tracking your progress on a new skill
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Details</CardTitle>
          <CardDescription>
            Enter the name of the skill you want to track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                placeholder="e.g., Guitar, Spanish, React Development"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!newSkillName.trim()}
              >
                Add Skill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSkillView;
