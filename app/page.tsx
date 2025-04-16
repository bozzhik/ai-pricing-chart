'use client'

import {useState, useEffect} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Checkbox} from '@/components/ui/checkbox'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ScrollArea} from '@/components/ui/scroll-area'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import {parseCsv} from '@/lib/csv-parser'
import {Button} from '@/components/ui/button'

const csvData = `Name,Input,Output
Gemini 2.0 Flash-Lite,$0.075,$0.30
Mistral 3.1 Small,$0.10,$0.30
Gemini 2.0 Flash,$0.10,$0.40
ChatGPT 4.1-nano,$0.10,$0.40
DeepSeek v3 (old),$0.14,$0.28
ChatGPT 4o-mini,$0.15,$0.60
DeepSeek v3,$0.27,$1.10
Grok 3-mini,$0.30,$0.50
ChatGPT 4.1-mini,$0.40,$1.60
DeepSeek r1,$0.55,$2.19
ChatGPT o3-mini,$1.10,$4.40
Gemini 2.5 Pro,$1.25,$10.00
ChatGPT 4.1,$2.00,$8.00
ChatGPT 4o,$2.50,$10.00
Claude 3.5 Sonnet,$3.00,$15.00
Grok 3,$3.00,$15.00
ChatGPT o1,$15.00,$60.00
ChatGPT 4.5,$75.00,$150.00
O1 Pro,$150.00,$600.00`

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [displayMode, setDisplayMode] = useState<string>('both')

  useEffect(() => {
    const parsedData = parseCsv(csvData)
    setData(parsedData)
    // Initially select all models
    setSelectedModels(parsedData.map((item) => item.Name))
  }, [])

  useEffect(() => {
    // Filter data based on selected models
    const filtered = data.filter((item) => selectedModels.includes(item.Name))
    setFilteredData(filtered)
  }, [selectedModels, data])

  const handleModelToggle = (modelName: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelName)) {
        return prev.filter((name) => name !== modelName)
      } else {
        return [...prev, modelName]
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedModels(data.map((item) => item.Name))
  }

  const handleDeselectAll = () => {
    setSelectedModels([])
  }

  const formatDollar = (value: string) => {
    // Remove $ and convert to number
    return Number.parseFloat(value.replace('$', ''))
  }

  // Group models by price range for filtering
  const lowPriceModels = data.filter((item) => formatDollar(item.Input) < 1).map((item) => item.Name)
  const midPriceModels = data.filter((item) => formatDollar(item.Input) >= 1 && formatDollar(item.Input) < 10).map((item) => item.Name)
  const highPriceModels = data.filter((item) => formatDollar(item.Input) >= 10).map((item) => item.Name)

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    switch (value) {
      case 'low':
        setSelectedModels(lowPriceModels)
        break
      case 'mid':
        setSelectedModels(midPriceModels)
        break
      case 'high':
        setSelectedModels(highPriceModels)
        break
      case 'all':
      default:
        setSelectedModels(data.map((item) => item.Name))
        break
    }
  }

  const handleDisplayModeChange = (value: string) => {
    setDisplayMode(value)
  }

  // Prepare chart data
  const chartData = filteredData.map((item) => ({
    name: item.Name,
    Input: formatDollar(item.Input),
    Output: formatDollar(item.Output),
  }))

  // Define colors for dark mode
  const inputColor = '#818cf8' // lighter indigo for dark mode
  const outputColor = '#22d3ee' // lighter cyan for dark mode

  // Custom tooltip styles for dark mode
  const CustomTooltip = ({active, payload, label}: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 rounded shadow-md bg-gray-800 text-white border border-gray-700">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{color: entry.color}}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="h-[600px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{top: 20, right: 30, left: 60, bottom: 120}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{fill: '#ffffff'}} />
                    <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} tick={{fill: '#ffffff'}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '20px',
                        color: '#ffffff',
                      }}
                    />
                    {(displayMode === 'both' || displayMode === 'input') && <Bar dataKey="Input" fill={inputColor} name="Input Cost" />}
                    {(displayMode === 'both' || displayMode === 'output') && <Bar dataKey="Output" fill={outputColor} name="Output Cost" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Toggle models to display</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Price Range</h3>
                      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid grid-cols-4 mb-4">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="low">Low</TabsTrigger>
                          <TabsTrigger value="mid">Mid</TabsTrigger>
                          <TabsTrigger value="high">High</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Display</h3>
                      <Tabs defaultValue="both" value={displayMode} onValueChange={handleDisplayModeChange}>
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger value="both">Both</TabsTrigger>
                          <TabsTrigger value="input">Input</TabsTrigger>
                          <TabsTrigger value="output">Output</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div>
                      <div className="flex justify-between mb-4">
                        <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs">
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDeselectAll} className="text-xs">
                          Deselect All
                        </Button>
                      </div>

                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-2">
                          {data.map((model) => (
                            <div key={model.Name} className="flex items-center space-x-2">
                              <Checkbox id={model.Name} checked={selectedModels.includes(model.Name)} onCheckedChange={() => handleModelToggle(model.Name)} />
                              <label htmlFor={model.Name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                {model.Name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center py-4 border-t border-gray-700">
        <div className="text-gray-400 text-sm">
          If you like this, check out{' '}
          <a href="https://t3.chat" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
            T3 Chat
          </a>{' '}
          •{' '}
          <a href="https://v0.dev/chat/xWqctb5ZQhR" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
            Fork this on V0
          </a>
        </div>
      </footer>
    </main>
  )
}
