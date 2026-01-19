import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buildImportFn, scrapeBulkImports, scrapeSingleUrlFn } from '@/data/firecrawl'
import { cn } from '@/lib/utils'
import {
  BulkUrlSchema,
  BulkUrlType,
  SingleUrlSchema,
  SingleUrlType,
} from '@/lib/validation'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { SearchResultWeb } from '@mendable/firecrawl-js'
import { TabsContent } from '@radix-ui/react-tabs'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, Link, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const singleUrlForm = useForm<SingleUrlType>({
    defaultValues: {
      url: '',
    },
    resolver: standardSchemaResolver(SingleUrlSchema),
  })

  const bulkUrlForm = useForm<BulkUrlType>({
    defaultValues: {
      url: '',
      search: undefined,
    },
    resolver: standardSchemaResolver(BulkUrlSchema),
  })
  const [transition, startTransition] = useTransition()
  const [discoveredUrls, setDiscoveredUrls] = useState<
    SearchResultWeb[] | undefined
  >()
  const [selectedUrls, setSelectedUrls] = useState<
  Set<string>
  >(new Set())

  function handleSelectAll(){
    if(selectedUrls.size===discoveredUrls?.length){
      setSelectedUrls(new Set())
    }
    else {
      setSelectedUrls(new Set(discoveredUrls?.map((each)=>each.url)))
    }
  }

  function handleToggleUrl(url:string){
    const newSelectedUrls=new Set(selectedUrls);
    if(selectedUrls.has(url)) {
      newSelectedUrls.delete(url)
    }
    else {
      newSelectedUrls.add(url)
    }
    setSelectedUrls(newSelectedUrls)
  }

  async function handleSingleUrlForm(data: SingleUrlType) {
    startTransition(async () => {
      const result = await scrapeSingleUrlFn({
        data: {
          url: data.url,
        },
      })
      if (result.status === 'COMPLETED') {
        toast.success('Successfully Scarapped the url')
      } else if (result.status === 'FAILED') {
        toast.error('Failed to Scrap. please try again')
      }
    })
  }

  


  async function handleBulkUrlForm(data: BulkUrlType) {
    startTransition(async () => {
      const result = await buildImportFn({
        data: {
          url: data.url,
          search: data.search,
        },
      })
      if (result) {
        toast.success('Successfully Mapped the url')
        setDiscoveredUrls(result.data?.links)
        return
      }
      toast.error('Failed to Map. please try again')
    })
  }

   function handleScrapeBulkImport(){
    if(selectedUrls.size===0) {
      toast.error("Please select atleast one URL.")
      return ;
    }
    startTransition(async()=>{
      await scrapeBulkImports({
         data:{
           urls:Array.from(selectedUrls)
         }
       })
       toast.success(`Successfully Scarapped ${selectedUrls.size} URls ` )
    })
  }

  return (
    <div className="flex flex-1 items-center  justify-center  py-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Import Your Content</h2>
          <p className="text-muted-foreground p-2">
            Save Web Pages to your library for later reading
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="w-full grid grid-cols-2 gap-3 ">
            <TabsTrigger value="single" className="gap-2 ">
              <Link className="size-4" />
              Single Url
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Globe className="size-4" />
              <span>Bulk Import</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Import Single Url</CardTitle>
                <CardDescription>
                  Scrap and save content from any web.👀
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <form
                  onSubmit={singleUrlForm.handleSubmit(handleSingleUrlForm)}
                >
                  <FieldGroup>
                    <Field>
                      <Input
                        {...singleUrlForm.register('url')}
                        disabled={transition}
                        type="url"
                        placeholder="Paste your single url"
                        className={cn(
                          'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 h-[100px] ring-0',
                          singleUrlForm.formState.errors.url &&
                            'focus-visible:border-red-600 focus-visible:border-2',
                        )}
                      />
                      <FieldError
                        errors={
                          singleUrlForm.formState.errors.url
                            ? [
                                {
                                  message:
                                    singleUrlForm.formState.errors.url.message,
                                },
                              ]
                            : undefined
                        }
                      />
                    </Field>
                    <Button
                      type="submit"
                      className="bg-blue-700 hover:bg-blue-500 text-white opacity-90"
                    >
                      {transition ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          "Processing...."
                        </>
                      ) : (
                        'Import Url '
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                  Discover and import multiple Urls from a website.🚀
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <form onSubmit={bulkUrlForm.handleSubmit(handleBulkUrlForm)}>
                  <FieldGroup>
                    <Field>
                      <Input
                        {...bulkUrlForm.register('url')}
                        disabled={transition}
                        type="url"
                        placeholder="Paste your single url"
                        className={cn(
                          'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 h-[100px] ring-0',
                          bulkUrlForm.formState.errors.url &&
                            'focus-visible:border-red-600 focus-visible:border-2',
                        )}
                      />
                      <FieldError
                        errors={
                          bulkUrlForm.formState.errors.url
                            ? [
                                {
                                  message:
                                    bulkUrlForm.formState.errors.url.message,
                                },
                              ]
                            : undefined
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Filter By (optioal)</FieldLabel>
                      <Input
                        {...bulkUrlForm.register('search')}
                        disabled={transition}
                        type="text"
                        placeholder="e.g docs, wesbite, blogs"
                        className={cn(
                          'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 h-[50px] ring-0',
                          bulkUrlForm.formState.errors.search &&
                            'focus-visible:border-red-600 focus-visible:border-2',
                        )}
                      />
                      <FieldError
                        errors={
                          bulkUrlForm.formState.errors.search
                            ? [
                                {
                                  message:
                                    bulkUrlForm.formState.errors.search.message,
                                },
                              ]
                            : undefined
                        }
                      />
                    </Field>
                    <Button
                      type="submit"
                      className="bg-blue-700 hover:bg-blue-500 text-white opacity-90"
                    >
                      {transition ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          "Processing...."
                        </>
                      ) : (
                        'Import Urls'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
                {discoveredUrls && discoveredUrls.length > 0 && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Found {discoveredUrls.length} URLs
                      </p>
                      <Button onClick={handleSelectAll} variant={'outline'} size={'sm'}>
                        {selectedUrls.size===discoveredUrls.length?"DisSelect All":"Select All"}
                      
                      </Button>
                    </div>

                    <div className="max-h-80 space-y-2 overflow-y-auto border rounded-md p-4">
                      {discoveredUrls.map((each) => {
                        return (
                          <Label
                            key={each.url}
                            className="hover:bg-muted/50 rounded-md flex items-start p-2 gap-3 border text-white"
                          >
                            <Checkbox onCheckedChange={()=>handleToggleUrl(each.url)} checked={selectedUrls.has(each.url)} className="mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-sm">
                                {each.title ?? 'Title has not been found'}
                              </p>
                              <p className="text-muted-foreground  truncate text-xs">
                                {each.description ??
                                  'Description has not been found'}
                              </p>
                              <p className="text-muted-foreground  truncate text-xs">
                                {each.url}
                              </p>
                            </div>
                          </Label>
                        )
                      })}
                    </div>
                    <Button disabled={transition}
                     onClick={handleScrapeBulkImport} className="w-full">
                      {
                      transition?"Importing..."  :selectedUrls.size>1?"Import":"Import URLs"
                      }
                      Import
                     </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
