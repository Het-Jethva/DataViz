import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "../app-sidebar"
import { SiteHeader } from "../site-header"
import { VizardLogo } from "../VizardLogo"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Send, User, Brain, MessageCircle, Sparkles, BarChart3, TrendingUp, Search, Layout } from "lucide-react"

export default function AskAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m Vizard, your Excel Analytics AI assistant. I can help you analyze spreadsheets, create charts, generate insights, and answer data-related questions. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateMockResponse(inputValue),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const generateMockResponse = (userInput) => {
    const responses = [
      "I've analyzed your data and found some interesting patterns. Let me break down the key insights for you.",
      "Based on your Excel data, I can generate several visualization options. Which type of chart would you prefer?",
      "I can help you with that analysis. Here are the statistical insights from your spreadsheet data.",
      "Great question! Let me process your Excel file and provide you with a comprehensive report.",
      "I've identified trends in your data that could be valuable for decision-making. Here's what I found...",
      "Your spreadsheet contains rich information. I can help you create pivot tables, charts, or statistical summaries.",
      "I can assist with data cleaning, formula optimization, and advanced Excel functions. What specific area needs attention?",
      "Let me analyze the data patterns and provide you with actionable business insights."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const quickActions = [
    { icon: BarChart3, label: "Create Visualization", description: "Generate charts from your data" },
    { icon: TrendingUp, label: "Analyze Trends", description: "Identify patterns and insights" },
    { icon: Search, label: "Data Insights", description: "Extract meaningful information" },
    { icon: Layout, label: "Generate Dashboard", description: "Create comprehensive reports" }
  ]

  const recentConversations = [
    { title: "Sales Dashboard Creation", timestamp: "2 hours ago" },
    { title: "Customer Analytics Chart", timestamp: "5 hours ago" },
    { title: "Revenue Trend Analysis", timestamp: "1 day ago" },
    { title: "Performance Metrics", timestamp: "2 days ago" }
  ]

  return (
    <SidebarProvider>
      <div className="h-screen flex bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SiteHeader />
          <main className="flex-1 p-6 overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex gap-6 overflow-hidden">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <div className="mb-6 flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <VizardLogo className="h-12 w-12" />
                    <div>
                      <h1 className="text-3xl font-bold">Vizard AI</h1>
                      <p className="text-muted-foreground text-lg">
                        Your intelligent data visualization assistant
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="outline">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
                    <Badge variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Real-time Chat
                    </Badge>
                    <Badge variant="outline">
                      <Brain className="h-3 w-3 mr-1" />
                      Smart Insights
                    </Badge>
                  </div>
                </div>

                {/* Chat Card */}
                <Card className="flex-1 flex flex-col min-h-0">
                  <CardHeader className="flex-shrink-0 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Vizard Assistant Chat
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-0 min-h-0">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                      <div className="space-y-6">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-4 ${
                              message.type === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.type === 'bot' && (
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarFallback className="bg-primary text-primary-foreground p-0">
                                  <VizardLogo className="h-6 w-6" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[70%] rounded-xl px-4 py-3 ${
                                message.type === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-2 ${
                                message.type === 'user' 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                            {message.type === 'user' && (
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarFallback>
                                  <User className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-4 justify-start">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary text-primary-foreground p-0">
                                <VizardLogo className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-xl px-4 py-3">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Input Area */}
                <div className="mt-4 flex-shrink-0">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ask Vizard about your data visualization needs..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send • Shift+Enter for new line
                  </p>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <aside className="w-80 flex flex-col gap-6 flex-shrink-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start h-auto p-4 flex-col items-start gap-2"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <action.icon className="h-5 w-5" />
                          <span className="font-medium">{action.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          {action.description}
                        </p>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentConversations.map((conversation, index) => (
                      <div key={index}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 flex-col items-start gap-1"
                        >
                          <h4 className="font-medium text-sm">{conversation.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {conversation.timestamp}
                          </p>
                        </Button>
                        {index < recentConversations.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
