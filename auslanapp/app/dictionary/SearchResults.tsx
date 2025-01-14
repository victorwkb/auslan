import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export interface DictionaryItem {
  entry_in_english: string;
  sub_entries: Array<{
    video_links?: string[];
    definitions?: Record<string, string[]>;
  }>;
}

interface DictionaryResultsProps {
  results: DictionaryItem[];
}

export function DictionaryResults({ results }: DictionaryResultsProps) {
  return (
    <div className="mt-8 grid gap-6">
      <Accordion
        type="single"
        className="space-y-2"
        defaultValue="entry-0"
        collapsible
      >
        {results.map((entry, index) => (
          <AccordionItem
            className="flex flex-col items-center"
            key={index}
            value={`entry-${index}`}
          >
            <Card className="border rounded-lg shadow-sm w-full max-w-2xl w-[720px]">
              <AccordionTrigger>
                <h2 className="text-xl font-semibold text-center max-w-2xl">
                  {entry.entry_in_english}
                </h2>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="p-4 space-y-4">
                  {entry.sub_entries.map((subEntry, subIndex) => (
                    <div key={subIndex} className="space-y-4">
                      {subEntry.definitions &&
                        Object.entries(subEntry.definitions).map(
                          ([key, definitions]) => (
                            <Card
                              key={key}
                              className="bg-buttons-secondary border rounded-lg shadow-sm"
                            >
                              <CardHeader>
                                <CardTitle className="flex w-full justify-end">
                                  <Badge>{key}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  {definitions.map((def, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col space-y-1"
                                    >
                                      <div className="flex items-start space-x-2 w-full text-left text-lg font-semibold">
                                        <span className="text-gray-700">
                                          {index + 1}.
                                        </span>
                                        <span className="text-gray-700">
                                          {def}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {/* Render video links if available */}
                                {subEntry.video_links &&
                                  subEntry.video_links.length > 0 && (
                                    <div className="flex justify-center mt-4">
                                      <video
                                        controls
                                        className="rounded-md"
                                        style={{
                                          maxWidth: "100%",
                                          height: "auto",
                                        }}
                                      >
                                        <source
                                          src={subEntry.video_links[0]}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  )}
                              </CardContent>
                            </Card>
                          ),
                        )}
                    </div>
                  ))}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
