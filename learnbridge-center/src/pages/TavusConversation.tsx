import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createTavusConversation } from "@/services/tavus";
import { useToast } from "@/components/ui/use-toast";

const TavusConversation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartConversation = async () => {
    setIsLoading(true);
    try {
      const conversationUrl = await createTavusConversation();
      window.open(conversationUrl, "_blank");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Start Tavus Conversation</h1>
        <p className="text-xl text-gray-600 mb-8">
          Click the button below to start a new conversation
        </p>
        <Button
          onClick={handleStartConversation}
          disabled={isLoading}
          size="lg"
          className="w-64"
        >
          {isLoading ? "Starting..." : "Start Conversation"}
        </Button>
      </div>
    </div>
  );
};

export default TavusConversation;
