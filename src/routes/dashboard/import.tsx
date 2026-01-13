import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { scrapeSingleUrlFn } from '@/data/firecrawl'
import { cn } from '@/lib/utils'
import {
  BulkUrlSchema,
  BulkUrlType,
  SingleUrlSchema,
  SingleUrlType,
} from '@/lib/validation'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { TabsContent } from '@radix-ui/react-tabs'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, Link, Loader2 } from 'lucide-react'
import { useTransition } from 'react'
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
      search: '',
    },
    resolver: standardSchemaResolver(BulkUrlSchema),
  })
  const [transition, startTransition] = useTransition()

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

  async function handleBulkUrlForm(data: BulkUrlType) {}

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
                        type="url"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
