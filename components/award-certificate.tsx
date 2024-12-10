"use client";

import { useState, useRef } from "react";
import { FileUpload } from "./file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Medal,
  Ribbon,
  Star,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Type,
  Award as AwardIcon,
  UserSquare,
  Palette,
  Download,
  Settings2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AwardCertificate } from "@/lib/certificate-data";
import {
  Signatory,
  initialAwards,
  initialSignatories,
} from "@/lib/certificate-data";
import {
  parseAwardsCSV,
  parseSignatoriesCSV,
  generateAwardsCSV,
  generateSignatoriesCSV,
  generateAwardsTemplate,
  generateSignatoriesTemplate,
} from "@/lib/csv-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AlertStatus = {
  show: boolean;
  type: "success" | "error";
  message: string;
  title: string;
};

const defaultBackgrounds = [
  {
    id: "1",
    name: "1",
    url: "/backgrounds/01.png",
  },
  {
    id: "2",
    name: "2",
    url: "/backgrounds/02.png",
  },
  {
    id: "3",
    name: "3",
    url: "/backgrounds/03.png",
  },
  {
    id: "4",
    name: "4",
    url: "/backgrounds/04.png",
  },
  {
    id: "5",
    name: "5",
    url: "/backgrounds/05.png",
  },
  {
    id: "6",
    name: "6",
    url: "/backgrounds/06.png",
  },
  {
    id: "7",
    name: "7",
    url: "/backgrounds/07.png",
  },
  {
    id: "8",
    name: "8",
    url: "/backgrounds/08.png",
  },
  {
    id: "9",
    name: "9",
    url: "/backgrounds/09.png",
  },
  {
    id: "10",
    name: "10",
    url: "/backgrounds/10.png",
  },
  {
    id: "11",
    name: "11",
    url: "/backgrounds/11.png",
  },
  {
    id: "12",
    name: "12",
    url: "/backgrounds/12.png",
  },
  {
    id: "13",
    name: "13",
    url: "/backgrounds/13.png",
  },
  {
    id: "14",
    name: "14",
    url: "/backgrounds/14.png",
  },
  {
    id: "15",
    name: "15",
    url: "/backgrounds/15.png",
  },
  {
    id: "16",
    name: "16",
    url: "/backgrounds/16.png",
  },
  {
    id: "17",
    name: "17",
    url: "/backgrounds/17.png",
  },
  {
    id: "18",
    name: "18",
    url: "/backgrounds/18.png",
  },
  {
    id: "19",
    name: "19",
    url: "/backgrounds/19.png",
  },
  {
    id: "20",
    name: "20",
    url: "/backgrounds/20.png",
  },
  {
    id: "21",
    name: "21",
    url: "/backgrounds/21.png",
  },
  {
    id: "22",
    name: "22",
    url: "/backgrounds/22.png",
  },
  {
    id: "23",
    name: "23",
    url: "/backgrounds/23.png",
  },
  {
    id: "24",
    name: "24",
    url: "/backgrounds/24.png",
  },
  {
    id: "25",
    name: "25",
    url: "/backgrounds/25.png",
  },
  {
    id: "26",
    name: "26",
    url: "/backgrounds/26.png",
  },
  {
    id: "27",
    name: "27",
    url: "/backgrounds/27.png",
  },
  {
    id: "28",
    name: "28",
    url: "/backgrounds/28.png",
  },
  {
    id: "29",
    name: "29",
    url: "/backgrounds/29.png",
  },
  {
    id: "30",
    name: "30",
    url: "/backgrounds/30.png",
  },
  {
    id: "31",
    name: "31",
    url: "/backgrounds/31.png",
  },
  {
    id: "32",
    name: "32",
    url: "/backgrounds/32.png",
  },
  {
    id: "33",
    name: "33",
    url: "/backgrounds/33.png",
  },
  {
    id: "34",
    name: "34",
    url: "/backgrounds/34.png",
  },
  {
    id: "35",
    name: "35",
    url: "/backgrounds/35.png",
  },
  {
    id: "36",
    name: "36",
    url: "/backgrounds/36.png",
  },
  {
    id: "37",
    name: "37",
    url: "/backgrounds/37.png",
  },
  {
    id: "38",
    name: "38",
    url: "/backgrounds/38.png",
  },
  {
    id: "39",
    name: "39",
    url: "/backgrounds/39.png",
  },
  {
    id: "40",
    name: "40",
    url: "/backgrounds/40.png",
  },
];

export default function AwardCertificate() {
  const [awards, setAwards] = useState<AwardCertificate[]>(initialAwards);
  const [signatories, setSignatories] =
    useState<Signatory[]>(initialSignatories);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [topRightImage, setTopRightImage] = useState<string | null>(null);
  const [topLeftImage, setTopLeftImage] = useState<string | null>(null);
  const [bottomRightImage, setBottomRightImage] = useState<string | null>(null);
  const [bottomLeftImage, setBottomLeftImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  const [topLeftOpacity, setTopLeftOpacity] = useState(0.2);
  const [topRightOpacity, setTopRightOpacity] = useState(0.2);
  const [bottomLeftOpacity, setBottomLeftOpacity] = useState(0.2);
  const [bottomRightOpacity, setBottomRightOpacity] = useState(0.2);
  const [topLeftRadius, setTopLeftRadius] = useState(0);
  const [topRightRadius, setTopRightRadius] = useState(0);
  const [bottomLeftRadius, setBottomLeftRadius] = useState(0);
  const [bottomRightRadius, setBottomRightRadius] = useState(0);

  const [titleColor, setTitleColor] = useState("#5d4037");
  const [recipientColor, setRecipientColor] = useState("#2c3e50");
  const [descriptionColor, setDescriptionColor] = useState("#5d4037");
  const [signatoryColor, setSignatoryColor] = useState("#2c3e50");
  const [mainTitleColor, setMainTitleColor] = useState("#2c3e50");
  const [mainTitle, setMainTitle] = useState("Certificate of Award");
  //const [decorativeColor, setDecorativeColor] = useState("#d4af37");
  const [ornamentalCornersColor, setOrnamentalCornersColor] =
    useState("#d4af37"); // New state variable
  const [decorativeElementsColor, setDecorativeElementsColor] =
    useState("#8b7355"); // New state variable
  const certificatesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [newAward, setNewAward] = useState<AwardCertificate>({
    recipient: "",
    title: "",
    description: "",
  });
  const [newSignatory, setNewSignatory] = useState<Signatory>({
    name: "",
    title: "",
  });
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(
    null
  );
  const [editingSignatoryIndex, setEditingSignatoryIndex] = useState<
    number | null
  >(null);
  const [certificateStyle, setCertificateStyle] = useState<"default" | "wide">(
    "default"
  );
  const [presentationText, setPresentationText] = useState(
    "This certificate is proudly presented to:"
  );

  const [importAlert, setImportAlert] = useState<AlertStatus>({
    show: false,
    type: "success",
    message: "",
    title: "",
  });

  const [borderIcons, setBorderIcons] = useState(true);
  const [borderIconBackdrop, setBorderIconBackdrop] = useState(true);
  const [edgeBorderOrnaments, setEdgeBorderOrnaments] = useState(true);
  const [edgeSpaceBorder, setEdgeSpaceBorder] = useState(true);
  const [border, setBorder] = useState(true);

  const [mainTitleFont, setMainTitleFont] = useState("var(--font-geist-sans)");
  const [titleFont, setTitleFont] = useState("var(--font-geist-sans)");
  const [recipientFont, setRecipientFont] = useState("var(--font-geist-sans)");
  const [descriptionFont, setDescriptionFont] = useState(
    "var(--font-geist-sans)"
  );
  const [signatoryFont, setSignatoryFont] = useState("var(--font-geist-sans)");

  const fontOptions = [
    { label: "Geist Sans", value: "var(--font-geist-sans)" },
    { label: "Geist Mono", value: "var(--font-geist-mono)" },
    // Add more fonts as you add them to layout.tsx
  ];

  const handleBackgroundUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setBackgroundImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTopRightUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setTopRightImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTopLeftUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setTopLeftImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBottomRightUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setBottomRightImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBottomLeftUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setBottomLeftImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDefaultBackgroundSelect = (url: string) => {
    setBackgroundImage(url);
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF({
      orientation: certificateStyle === "wide" ? "landscape" : "portrait",
      unit: "in",
      format: certificateStyle === "wide" ? [13, 8.5] : [8.5, 11],
    });

    // Use consistent margins and calculate usable space
    const margin = 1; // 1 inch margin
    const pageWidth = certificateStyle === "wide" ? 13 : 8.5;
    const pageHeight = certificateStyle === "wide" ? 8.5 : 11;
    const usableWidth = pageWidth - 2 * margin;

    for (let i = 0; i < awards.length; i++) {
      // Add new page for each certificate in landscape, or every 2 certificates in portrait
      if (i > 0 && (certificateStyle === "wide" || i % 2 === 0)) {
        pdf.addPage();
      }

      const certificate = certificatesRef.current[i];
      if (certificate) {
        const canvas = await html2canvas(certificate, {
          scale: 2,
          logging: false,
          useCORS: true,
        });

        // Calculate dimensions to maintain 3:2 aspect ratio
        let imgWidth, imgHeight, xPosition, yPosition;

        if (certificateStyle === "wide") {
          // For landscape: use full usable width and calculate height
          imgWidth = usableWidth;
          imgHeight = (imgWidth * 2) / 3; // maintain 3:2 ratio
          xPosition = margin;
          yPosition = (pageHeight - imgHeight) / 2; // center vertically
        } else {
          // For portrait: fit two certificates per page
          imgWidth = usableWidth;
          imgHeight = (imgWidth * 2) / 3; // maintain 3:2 ratio
          xPosition = margin;
          yPosition = i % 2 === 0 ? margin : margin + imgHeight + 0.5; // 0.5 inch gap between certificates
        }

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", xPosition, yPosition, imgWidth, imgHeight);
      }
    }

    pdf.save("awards.pdf");
  };

  const addAward = () => {
    if (newAward.recipient && newAward.title && newAward.description) {
      setAwards([...awards, newAward]);
      setNewAward({ recipient: "", title: "", description: "" });
    }
  };

  const updateAward = (index: number) => {
    const updatedAwards = [...awards];
    updatedAwards[index] = newAward;
    setAwards(updatedAwards);
    setNewAward({ recipient: "", title: "", description: "" });
    setEditingAwardIndex(null);
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const addSignatory = () => {
    if (newSignatory.name && newSignatory.title) {
      setSignatories([...signatories, newSignatory]);
      setNewSignatory({ name: "", title: "" });
    }
  };

  const updateSignatory = (index: number) => {
    const updatedSignatories = [...signatories];
    updatedSignatories[index] = newSignatory;
    setSignatories(updatedSignatories);
    setNewSignatory({ name: "", title: "" });
    setEditingSignatoryIndex(null);
  };

  const removeSignatory = (index: number) => {
    setSignatories(signatories.filter((_, i) => i !== index));
  };

  const handleAwardsCSVImport = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const awards = parseAwardsCSV(content).filter(
            (award) => award.recipient && award.title && award.description
          ); // Filter out empty entries
          setAwards(awards);
          setImportAlert({
            show: true,
            type: "success",
            title: "Awards Imported",
            message: `Successfully imported ${awards.length} awards`,
          });
          setTimeout(() => {
            setImportAlert((prev) => ({ ...prev, show: false }));
          }, 3000);
        } catch (err) {
          console.error("Failed to import awards:", err);
          setImportAlert({
            show: true,
            type: "error",
            title: "Import Failed",
            message: `Failed to import: ${
              err instanceof Error ? err.message : "Invalid format"
            }`,
          });
          setTimeout(() => {
            setImportAlert((prev) => ({ ...prev, show: false }));
          }, 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSignatoriesCSVImport = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const signatories = parseSignatoriesCSV(content).filter(
            (signatory) => signatory.name && signatory.title
          ); // Filter out empty entries
          setSignatories(signatories);
          setImportAlert({
            show: true,
            type: "success",
            title: "Signatories Imported",
            message: `Successfully imported ${signatories.length} signatories`,
          });
          setTimeout(() => {
            setImportAlert((prev) => ({ ...prev, show: false }));
          }, 3000);
        } catch (err) {
          console.error("Failed to import signatories:", err);
          setImportAlert({
            show: true,
            type: "error",
            title: "Import Failed",
            message: `Failed to import: ${
              err instanceof Error ? err.message : "Invalid format"
            }`,
          });
          setTimeout(() => {
            setImportAlert((prev) => ({ ...prev, show: false }));
          }, 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  const exportAwardsCSV = () => {
    const csv = generateAwardsCSV(awards);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "awards.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportSignatoriesCSV = () => {
    const csv = generateSignatoriesCSV(signatories);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signatories.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadAwardsTemplate = () => {
    const csv = generateAwardsTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "awards-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadSignatoriesTemplate = () => {
    const csv = generateSignatoriesTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signatories-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8f4e8] p-4">
      {/* Main container with side-by-side layout */}
      <div className="flex flex-col 2xl:flex-row gap-8 max-w-[1800px] mx-auto">
        {/* Certificate Settings Panel */}
        <div className="w-full 2xl:w-[600px] 2xl:flex-shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-800">
              Certificate Settings
            </h1>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full grid grid-cols-7 gap-2 mb-20">
              <TabsTrigger
                value="general"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <Settings2 className="w-4 h-4" />
                  <span className="text-sm font-medium">General</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Images</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="colors"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-medium">Colors</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="awards"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <AwardIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Awards</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="signatories"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <UserSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Signatories</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="styles"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <Palette className="w-4 h-4" />
                  <span className="text-sm font-medium">Styles</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="export"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Print</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {importAlert.show && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
                <Alert
                  className={`w-96 ${
                    importAlert.type === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {importAlert.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle
                    className={`${
                      importAlert.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {importAlert.title}
                  </AlertTitle>
                  <AlertDescription
                    className={`${
                      importAlert.type === "success"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {importAlert.message}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <TabsContent value="general" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        General Settings
                      </h2>
                      <p className="text-sm text-gray-500">
                        Configure global certificate settings
                      </p>
                    </div>
                    <Settings2 className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Settings Form */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Certificate Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="mainTitle" className="text-sm">
                              Main Title
                            </Label>
                            <Input
                              id="mainTitle"
                              type="text"
                              value={mainTitle}
                              onChange={(e) => setMainTitle(e.target.value)}
                              placeholder="Enter certificate title"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="presentationText"
                              className="text-sm"
                            >
                              Presentation Text
                            </Label>
                            <Textarea
                              id="presentationText"
                              value={presentationText}
                              onChange={(e) =>
                                setPresentationText(e.target.value)
                              }
                              placeholder="Enter presentation text"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              id="borderIcons"
                              checked={borderIcons}
                              onChange={() => {
                                setBorderIcons(!borderIcons);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="borderIcons" className="ml-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Border Icons
                                </p>
                                <p className="text-xs text-gray-500">
                                  Toggle the Border icons
                                </p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              id="borderIconBackdrop"
                              checked={borderIconBackdrop}
                              onChange={() => {
                                setBorderIconBackdrop(!borderIconBackdrop);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                              htmlFor="borderIconBackdrop"
                              className="ml-3"
                            >
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Border Icon Backdrop
                                </p>
                                <p className="text-xs text-gray-500">
                                  Toggle the Border icon backdrop
                                </p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              id="edgeBorderOrnaments"
                              checked={edgeBorderOrnaments}
                              onChange={() => {
                                setEdgeBorderOrnaments(!edgeBorderOrnaments);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                              htmlFor="edgeBorderOrnaments"
                              className="ml-3"
                            >
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Edge Border Ornaments
                                </p>
                                <p className="text-xs text-gray-500">
                                  Toggle the Edge border ornaments
                                </p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              id="edgeSpaceBorder"
                              checked={edgeSpaceBorder}
                              onChange={() => {
                                setEdgeSpaceBorder(!edgeSpaceBorder);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="edgeSpaceBorder" className="ml-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Edge Space Border
                                </p>
                                <p className="text-xs text-gray-500">
                                  Toggle the Edge space border
                                </p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              id="border"
                              checked={border}
                              onChange={() => {
                                setBorder(!border);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="border" className="ml-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Border</p>
                                <p className="text-xs text-gray-500">
                                  Toggle the Border
                                </p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips Card */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Font Settings
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              id: "mainTitleFont",
                              label: "Main Title Font",
                              value: mainTitleFont,
                              setter: setMainTitleFont,
                            },
                            {
                              id: "titleFont",
                              label: "Title Font",
                              value: titleFont,
                              setter: setTitleFont,
                            },
                            {
                              id: "recipientFont",
                              label: "Recipient Font",
                              value: recipientFont,
                              setter: setRecipientFont,
                            },
                            {
                              id: "descriptionFont",
                              label: "Description Font",
                              value: descriptionFont,
                              setter: setDescriptionFont,
                            },
                            {
                              id: "signatoryFont",
                              label: "Signatory Font",
                              value: signatoryFont,
                              setter: setSignatoryFont,
                            },
                          ].map((item) => (
                            <div key={item.id} className="space-y-2">
                              <Label htmlFor={item.id} className="text-sm">
                                {item.label}
                              </Label>
                              <select
                                id={item.id}
                                value={item.value}
                                onChange={(e) => item.setter(e.target.value)}
                                className="w-full rounded-md border border-gray-200 p-2"
                              >
                                {fontOptions.map((font) => (
                                  <option key={font.value} value={font.value}>
                                    {font.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • The main title appears at the top of all
                            certificates
                          </li>
                          <li>
                            • Presentation text appears above recipient&apos;s
                            name
                          </li>
                          <li>• Keep text formal and professional</li>
                          <li>• Changes apply to all certificates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Image Management
                      </h2>
                      <p className="text-sm text-gray-500">
                        Manage certificate images and opacity
                      </p>
                    </div>
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Background Section */}

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <label className="text-base">For Background : </label>

                    {/* Default Backgrounds */}
                    <div className="space-y-4">
                      <Label className="text-sm">
                        Choose from Default Backgrounds
                      </Label>
                      <div className="h-[300px] overflow-y-auto rounded-lg border border-gray-200 p-4">
                        <div className="grid grid-cols-3 gap-4">
                          {defaultBackgrounds.map((bg) => (
                            <button
                              key={bg.id}
                              onClick={() =>
                                handleDefaultBackgroundSelect(bg.url)
                              }
                              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                backgroundImage === bg.url
                                  ? "border-blue-500 ring-2 ring-blue-200"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <img
                                src={bg.url}
                                alt={bg.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium">
                                  {bg.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">
                          Or
                        </span>
                      </div>
                    </div>

                    <div>
                      {/* Custom Upload */}
                      <div className="grid grid-cols-2 gap-0">
                        <div className="space-y-2">
                          <Label className="text-sm">Custom Background :</Label>
                        </div>
                        <div>
                          <FileUpload
                            onFileSelect={handleBackgroundUpload}
                            label="Background"
                          />
                          {backgroundImage && (
                            <Button
                              onClick={() => setBackgroundImage(null)}
                              variant="outline"
                              className="mt-4 w-full text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Background
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            {/* For Corner Images */}
                            <label className="text-base">
                              For Corner Images :{" "}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <label className="text-sm">Top Left : </label>
                              <FileUpload
                                onFileSelect={handleTopLeftUpload}
                                label="Top Left"
                              />
                              {topLeftImage && (
                                <Button
                                  onClick={() => setTopLeftImage(null)}
                                  variant="outline"
                                  className="mt-4 w-full text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Top Left
                                </Button>
                              )}
                              <label className="text-sm">Top Right : </label>
                              <FileUpload
                                onFileSelect={handleTopRightUpload}
                                label="Top Right"
                              />
                              {topRightImage && (
                                <Button
                                  onClick={() => setTopRightImage(null)}
                                  variant="outline"
                                  className="mt-4 w-full text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Top Right
                                </Button>
                              )}
                              <label className="text-sm">Bottom Left : </label>
                              <FileUpload
                                onFileSelect={handleBottomLeftUpload}
                                label="Bottom Left"
                              />
                              {bottomLeftImage && (
                                <Button
                                  onClick={() => setBottomLeftImage(null)}
                                  variant="outline"
                                  className="mt-4 w-full text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Bottom Left
                                </Button>
                              )}
                              <label className="text-sm">Bottom Right : </label>
                              <FileUpload
                                onFileSelect={handleBottomRightUpload}
                                label="Bottom Right"
                              />
                              {bottomRightImage && (
                                <Button
                                  onClick={() => setBottomRightImage(null)}
                                  variant="outline"
                                  className="mt-4 w-full text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Bottom Right
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            {/* For Border of Images */}

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="topLeftRadius"
                                  className="text-sm"
                                >
                                  Top Left Corner Radius
                                </Label>
                                <span className="text-sm text-gray-500">
                                  {topLeftRadius}px
                                </span>
                              </div>
                              <Input
                                id="topLeftRadius"
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={topLeftRadius}
                                onChange={(e) =>
                                  setTopLeftRadius(parseInt(e.target.value))
                                }
                                className="flex-1"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="topRightRadius"
                                  className="text-sm"
                                >
                                  Top Right Corner Radius
                                </Label>
                                <span className="text-sm text-gray-500">
                                  {topRightRadius}px
                                </span>
                              </div>
                              <Input
                                id="topRightRadius"
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={topRightRadius}
                                onChange={(e) =>
                                  setTopRightRadius(parseInt(e.target.value))
                                }
                                className="flex-1"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="bottomLeftRadius"
                                  className="text-sm"
                                >
                                  Bottom Left Corner Radius
                                </Label>
                                <span className="text-sm text-gray-500">
                                  {bottomLeftRadius}px
                                </span>
                              </div>
                              <Input
                                id="bottomLeftRadius"
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={bottomLeftRadius}
                                onChange={(e) =>
                                  setBottomLeftRadius(parseInt(e.target.value))
                                }
                                className="flex-1"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="bottomRightRadius"
                                  className="text-sm"
                                >
                                  Bottom Right Corner Radius
                                </Label>
                                <span className="text-sm text-gray-500">
                                  {bottomRightRadius}px
                                </span>
                              </div>
                              <Input
                                id="bottomRightRadius"
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={bottomRightRadius}
                                onChange={(e) =>
                                  setBottomRightRadius(parseInt(e.target.value))
                                }
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Opacity Controls */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Opacity Settings
                        </h3>
                        <div className="space-y-2">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label
                                htmlFor="backgroundOpacity"
                                className="text-sm"
                              >
                                Background Opacity
                              </Label>
                              <span className="text-sm text-gray-500">
                                {(backgroundOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Input
                              id="backgroundOpacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={backgroundOpacity}
                              onChange={(e) =>
                                setBackgroundOpacity(parseFloat(e.target.value))
                              }
                              className="flex-1"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label
                                htmlFor="topLeftOpacity"
                                className="text-sm"
                              >
                                Top Left Corner Opacity
                              </Label>
                              <span className="text-sm text-gray-500">
                                {(topLeftOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Input
                              id="topLeftOpacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={topLeftOpacity}
                              onChange={(e) =>
                                setTopLeftOpacity(parseFloat(e.target.value))
                              }
                              className="flex-1"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label
                                htmlFor="topRightOpacity"
                                className="text-sm"
                              >
                                Top Right Corner Opacity
                              </Label>
                              <span className="text-sm text-gray-500">
                                {(topRightOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Input
                              id="topRightOpacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={topRightOpacity}
                              onChange={(e) =>
                                setTopRightOpacity(parseFloat(e.target.value))
                              }
                              className="flex-1"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label
                                htmlFor="bottomLeftOpacity"
                                className="text-sm"
                              >
                                Bottom Left Corner Opacity
                              </Label>
                              <span className="text-sm text-gray-500">
                                {(bottomLeftOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Input
                              id="bottomLeftOpacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={bottomLeftOpacity}
                              onChange={(e) =>
                                setBottomLeftOpacity(parseFloat(e.target.value))
                              }
                              className="flex-1"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label
                                htmlFor="bottomRightOpacity"
                                className="text-sm"
                              >
                                Bottom Right Corner Opacity
                              </Label>
                              <span className="text-sm text-gray-500">
                                {(bottomRightOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Input
                              id="bottomRightOpacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={bottomRightOpacity}
                              onChange={(e) =>
                                setBottomRightOpacity(
                                  parseFloat(e.target.value)
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tips Card */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • Adjust background opacity for better text
                            readability
                          </li>
                          <li>
                            • Corner images work best at lower opacity levels
                          </li>
                          <li>• Changes apply to all certificates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Color Settings
                      </h2>
                      <p className="text-sm text-gray-500">
                        Customize Element colors and styles
                      </p>
                    </div>
                    <Type className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Color Controls */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Text Colors
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              id: "mainTitleColor",
                              label: "Main Title",
                              value: mainTitleColor,
                              setter: setMainTitleColor,
                            },
                            {
                              id: "titleColor",
                              label: "Title",
                              value: titleColor,
                              setter: setTitleColor,
                            },
                            {
                              id: "recipientColor",
                              label: "Recipient",
                              value: recipientColor,
                              setter: setRecipientColor,
                            },
                            {
                              id: "descriptionColor",
                              label: "Description",
                              value: descriptionColor,
                              setter: setDescriptionColor,
                            },
                            {
                              id: "signatoryColor",
                              label: "Signatory",
                              value: signatoryColor,
                              setter: setSignatoryColor,
                            },
                          ].map((item) => (
                            <div key={item.id} className="space-y-2">
                              <Label htmlFor={item.id} className="text-sm">
                                {item.label}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  id={item.id}
                                  type="color"
                                  value={item.value}
                                  onChange={(e) => item.setter(e.target.value)}
                                  className="w-12 h-8"
                                />
                                <Input
                                  type="text"
                                  value={item.value}
                                  onChange={(e) => item.setter(e.target.value)}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Decorative Colors */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Decorative Elements
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              id: "decorativeElementsColor",
                              label: "Decorative Elements",
                              value: decorativeElementsColor,
                              setter: setDecorativeElementsColor,
                            },
                            {
                              id: "ornamentalCornersColor",
                              label: "Ornamental Corners",
                              value: ornamentalCornersColor,
                              setter: setOrnamentalCornersColor,
                            },
                          ].map((item) => (
                            <div key={item.id} className="space-y-2">
                              <Label htmlFor={item.id} className="text-sm">
                                {item.label}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  id={item.id}
                                  type="color"
                                  value={item.value}
                                  onChange={(e) => item.setter(e.target.value)}
                                  className="w-12 h-8"
                                />
                                <Input
                                  type="text"
                                  value={item.value}
                                  onChange={(e) => item.setter(e.target.value)}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips Card */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • Use contrasting colors for better readability
                          </li>
                          <li>
                            • Consider the background color when choosing font
                            colors
                          </li>
                          <li>• Changes apply to all certificates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="awards" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Award Management
                      </h2>
                      <p className="text-sm text-gray-500">
                        Create and edit award certificates
                      </p>
                    </div>
                    <AwardIcon className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Award Creation Section */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Award Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="awardTitle" className="text-sm">
                              Award Title
                            </Label>
                            <Input
                              id="awardTitle"
                              value={newAward.title}
                              onChange={(e) =>
                                setNewAward({
                                  ...newAward,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Enter award title"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="recipient" className="text-sm">
                              Recipient
                            </Label>
                            <Input
                              id="recipient"
                              value={newAward.recipient}
                              onChange={(e) =>
                                setNewAward({
                                  ...newAward,
                                  recipient: e.target.value,
                                })
                              }
                              placeholder="Enter recipient name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="description" className="text-sm">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              value={newAward.description}
                              onChange={(e) =>
                                setNewAward({
                                  ...newAward,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Enter award description"
                              className="mt-1"
                            />
                          </div>
                          {editingAwardIndex !== null ? (
                            <Button
                              onClick={() => updateAward(editingAwardIndex)}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              Update Award
                            </Button>
                          ) : (
                            <Button onClick={addAward} className="w-full">
                              Add Award
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Awards List Section */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Current Awards
                        </h3>
                        <div className="space-y-3">
                          {awards.map((award, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="space-y-1">
                                <p className="font-medium text-sm">
                                  {award.recipient}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {award.title}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    setNewAward(award);
                                    setEditingAwardIndex(index);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => removeAward(index)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {awards.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No awards added yet
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tips Card */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • Each award will generate a separate certificate
                          </li>
                          <li>• You can edit awards at any time</li>
                          <li>• Keep descriptions concise for better layout</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signatories" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Signatory Management
                      </h2>
                      <p className="text-sm text-gray-500">
                        Manage certificate signatories
                      </p>
                    </div>
                    <UserSquare className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Signatory Form */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Add Signatory
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="signatoryName" className="text-sm">
                              Name
                            </Label>
                            <Input
                              id="signatoryName"
                              value={newSignatory.name}
                              onChange={(e) =>
                                setNewSignatory({
                                  ...newSignatory,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter signatory name"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="signatoryTitle" className="text-sm">
                              Title
                            </Label>
                            <Input
                              id="signatoryTitle"
                              value={newSignatory.title}
                              onChange={(e) =>
                                setNewSignatory({
                                  ...newSignatory,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Enter signatory title"
                              className="mt-1"
                            />
                          </div>
                          {editingSignatoryIndex !== null ? (
                            <Button
                              onClick={() =>
                                updateSignatory(editingSignatoryIndex)
                              }
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              Update Signatory
                            </Button>
                          ) : (
                            <Button onClick={addSignatory} className="w-full">
                              Add Signatory
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Signatories List */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Current Signatories
                        </h3>
                        <div className="space-y-3">
                          {signatories.map((signatory, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="space-y-1">
                                <p className="font-medium text-sm">
                                  {signatory.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {signatory.title}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    setNewSignatory(signatory);
                                    setEditingSignatoryIndex(index);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => removeSignatory(index)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {signatories.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No signatories added yet
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tips Card */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • Add multiple signatories for official certificates
                          </li>
                          <li>• Include proper titles for authenticity</li>
                          <li>• All signatories appear on every certificate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="styles" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Style Settings
                      </h2>
                      <p className="text-sm text-gray-500">
                        Configure certificate layout
                      </p>
                    </div>
                    <Palette className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Style Options */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Layout Options
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="radio"
                              id="defaultStyle"
                              name="certificateStyle"
                              checked={certificateStyle === "default"}
                              onChange={() => setCertificateStyle("default")}
                              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="defaultStyle" className="ml-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Default Style (Portrait)
                                </p>
                                <p className="text-xs text-gray-500">
                                  Best for short certificates
                                </p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="radio"
                              id="wideStyle"
                              name="certificateStyle"
                              checked={certificateStyle === "wide"}
                              onChange={() => setCertificateStyle("wide")}
                              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="wideStyle" className="ml-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Wide Style (Landscape)
                                </p>
                                <p className="text-xs text-gray-500">
                                  Best for long certificates
                                </p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview and Tips */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Layout Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • Portrait style fits two certificates per page
                          </li>
                          <li>
                            • Landscape style uses one certificate per page
                          </li>
                          <li>• Choose based on your content length</li>
                          <li>• Style changes apply to all certificates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Import/Export Options
                      </h2>
                      <p className="text-sm text-gray-500">
                        Import/Export data and certificates
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Import Section */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Import Data
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label htmlFor="awardsImport" className="text-sm">
                                Import Awards CSV
                              </Label>
                              <Button
                                onClick={downloadAwardsTemplate}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Download Template
                              </Button>
                            </div>
                            <Input
                              id="awardsImport"
                              type="file"
                              accept=".csv"
                              onChange={handleAwardsCSVImport}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label
                                htmlFor="signatoriesImport"
                                className="text-sm"
                              >
                                Import Signatories CSV
                              </Label>
                              <Button
                                onClick={downloadSignatoriesTemplate}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Download Template
                              </Button>
                            </div>
                            <Input
                              id="signatoriesImport"
                              type="file"
                              accept=".csv"
                              onChange={handleSignatoriesCSVImport}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Tips Card */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          CSV Format Guide
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Awards CSV Format:
                            </p>
                            <code className="text-xs text-blue-700 block mt-1 bg-blue-50/50 p-2 rounded">
                              recipient,title,description
                            </code>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Signatories CSV Format:
                            </p>
                            <code className="text-xs text-blue-700 block mt-1 bg-blue-50/50 p-2 rounded">
                              name,title
                            </code>
                          </div>
                          <ul className="text-sm text-blue-700 space-y-1 mt-2">
                            <li>• Download templates for correct format</li>
                            <li>• Make sure to include all required columns</li>
                            <li>• Save files in CSV format</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Export Section */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Export Data
                        </h3>
                        <div className="space-y-4">
                          <Button
                            onClick={exportAwardsCSV}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Awards CSV
                          </Button>
                          <Button
                            onClick={exportSignatoriesCSV}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Signatories CSV
                          </Button>
                          <Button
                            onClick={exportToPDF}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Certificates PDF
                          </Button>
                        </div>
                      </div>

                      {/* Tips Card */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Import/Export Tips
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>
                            • CSV files should include headers: recipient,
                            title, description
                          </li>
                          <li>• For signatories: name, title</li>
                          <li>
                            • Export your data before making major changes
                          </li>
                          <li>
                            • PDF export includes all current certificates
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Certificates Preview Panel */}
        <div className="w-full 2xl:flex-1 relative">
          <div className="sticky top-4">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-8 h-8 text-gray-700" />
              <h2 className="text-3xl font-bold text-gray-800">
                Certificate Preview
              </h2>
            </div>

            {/* Full-Screen Mobile Warning Overlay */}
            {/* <div className="fixed inset-0 bg-black/100 z-50 flex items-center justify-center p-4 sm:hidden">
              <div className="bg-white rounded-lg p-6 max-w-sm text-center space-y-4">
                <RotateCcw className="w-12 h-12 mx-auto text-blue-600 animate-spin-slow" />
                <h3 className="text-xl font-bold text-gray-900">
                  Please Rotate Your Device
                </h3>
                <p className="text-gray-600">
                  For the best certificate editing experience:
                </p>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• Rotate your device to landscape mode</li>
                  <li>• Set the Browser to Desktop Mode</li>
                  <li>• Or use a desktop/laptop computer</li>
                </ul>
                <p className="text-xs text-gray-500">
                  The certificate editor requires a wider screen for optimal use
                </p>
              </div>
            </div> */}

            {/* Scrollable container for certificates */}
            <div className="overflow-y-auto 2xl:max-h-[calc(100vh-120px)] pr-4 -mr-4">
              <div
                className={`space-y-8 ${
                  certificateStyle === "wide" ? "max-w-[1000px]" : "max-w-3xl"
                }`}
              >
                {awards.map((award, index) => (
                  <div
                    key={index}
                    ref={(el) => (certificatesRef.current[index] = el)}
                    className={`relative bg-white rounded-lg shadow-2xl aspect-[3/2] ${
                      border ? " border-[10px]" : "overflow-hidden"
                    }`}
                    style={{
                      borderColor: ornamentalCornersColor,
                    }}
                  >
                    {/* Add a container div with certificate-content class */}
                    <div className="certificate-content relative z-10 h-full flex flex-col items-center justify-center">
                      {/* Background Image */}
                      <div className="text-center py-4">
                        {backgroundImage && (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${backgroundImage})`,
                              opacity: backgroundOpacity,
                            }}
                            role="presentation"
                            aria-hidden="true"
                            aria-label="Certificate background"
                          />
                        )}
                        {/* Corner Images */}
                        {topLeftImage && (
                          <div
                            className="absolute top-4 left-4 w-24 h-24 bg-cover bg-center overflow-hidden"
                            style={{
                              backgroundImage: `url(${topLeftImage})`,
                              opacity: topLeftOpacity,
                              borderRadius: `${topLeftRadius}px`,
                            }}
                            role="presentation"
                            aria-hidden="true"
                            aria-label="Top left decorative image"
                          />
                        )}
                        {topRightImage && (
                          <div
                            className="absolute top-4 right-4 w-24 h-24 bg-cover bg-center overflow-hidden"
                            style={{
                              backgroundImage: `url(${topRightImage})`,
                              opacity: topRightOpacity,
                              borderRadius: `${topRightRadius}px`,
                            }}
                            role="presentation"
                            aria-hidden="true"
                            aria-label="Top right decorative image"
                          />
                        )}
                        {bottomLeftImage && (
                          <div
                            className="absolute bottom-4 left-4 w-24 h-24 bg-cover bg-center overflow-hidden"
                            style={{
                              backgroundImage: `url(${bottomLeftImage})`,
                              opacity: bottomLeftOpacity,
                              borderRadius: `${bottomLeftRadius}px`,
                            }}
                            role="presentation"
                            aria-hidden="true"
                            aria-label="Bottom left decorative image"
                          />
                        )}
                        {bottomRightImage && (
                          <div
                            className="absolute bottom-4 right-4 w-24 h-24 bg-cover bg-center overflow-hidden"
                            style={{
                              backgroundImage: `url(${bottomRightImage})`,
                              opacity: bottomRightOpacity,
                              borderRadius: `${bottomRightRadius}px`,
                            }}
                            role="presentation"
                            aria-hidden="true"
                            aria-label="Bottom right decorative image"
                          />
                        )}
                      </div>

                      {/* Decorative Elements */}
                      {borderIcons && (
                        <>
                          <div
                            className={`absolute ${
                              border ? "-top-1 -left-1" : "-top-0 -left-0"
                            } z-20`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <Medal className="w-6 h-6" />
                          </div>

                          <div
                            className={`absolute ${
                              border ? "-top-1 -right-1" : "-top-0 -right-0"
                            } z-20`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <Medal className="w-6 h-6" />
                          </div>

                          <div
                            className={`absolute ${
                              border ? "-bottom-1 -left-1" : "-bottom-0 -left-0"
                            } z-20`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <Ribbon className="w-6 h-6" />
                          </div>

                          <div
                            className={`absolute ${
                              border
                                ? "-bottom-1 -right-1"
                                : "-bottom-0 -right-0"
                            } z-20`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <Ribbon className="w-6 h-6" />
                          </div>
                        </>
                      )}

                      {borderIconBackdrop && (
                        <>
                          {/* Decoration Backdrop */}
                          <div
                            className={`absolute ${
                              border ? "-top-1 -left-1" : "-top-0 -left-0"
                            } z-10`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <svg width="40" height="40" viewBox="0 0 40 40">
                              <path
                                d="M0 0 L40 0 L0 40 Z"
                                fill={ornamentalCornersColor}
                              />
                            </svg>
                          </div>

                          <div
                            className={`absolute ${
                              border ? "-top-1 -right-1" : "-top-0 -right-0"
                            } z-10`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <svg width="40" height="40" viewBox="0 0 40 40">
                              <path
                                d="M0 0 L40 0 L40 40 Z"
                                fill={ornamentalCornersColor}
                              />
                            </svg>
                          </div>

                          <div
                            className={`absolute ${
                              border ? "-bottom-1 -left-1" : "-bottom-0 -left-0"
                            } z-10`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <svg width="40" height="40" viewBox="0 0 40 40">
                              <path
                                d="M0 0 L0 40 L40 40 Z"
                                fill={ornamentalCornersColor}
                              />
                            </svg>
                          </div>

                          <div
                            className={`absolute ${
                              border
                                ? "-bottom-1 -right-1"
                                : "-bottom-0 -right-0"
                            } z-10`}
                            style={{
                              color: decorativeElementsColor,
                            }}
                          >
                            <svg width="40" height="40" viewBox="0 0 40 40">
                              <path
                                d="M40 0 L40 40 L0 40 Z"
                                fill={ornamentalCornersColor}
                              />
                            </svg>
                          </div>
                        </>
                      )}

                      {/* Ornamental Corners with fixed alignment */}
                      {edgeBorderOrnaments && (
                        <>
                          <div className="absolute inset-0">
                            {/* Gold borders */}
                            <div
                              className="absolute top-0 left-0 w-24 h-24 border-l-8 border-t-8"
                              style={{
                                borderColor: ornamentalCornersColor,
                              }}
                            />
                            <div
                              className="absolute top-0 right-0 w-24 h-24 border-r-8 border-t-8"
                              style={{
                                borderColor: ornamentalCornersColor,
                              }}
                            />
                            <div
                              className="absolute bottom-0 left-0 w-24 h-24 border-l-8 border-b-8"
                              style={{
                                borderColor: ornamentalCornersColor,
                              }}
                            />
                            <div
                              className="absolute bottom-0 right-0 w-24 h-24 border-r-8 border-b-8"
                              style={{
                                borderColor: ornamentalCornersColor,
                              }}
                            />
                          </div>
                        </>
                      )}

                      {edgeSpaceBorder && (
                        <>
                          {/* Brown borders positioned below gold */}
                          <div
                            className={`absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 rounded-tl-lg`}
                            style={{
                              opacity: topLeftImage ? 0 : 1,
                              borderColor: decorativeElementsColor,
                            }}
                          />
                          <div
                            className={`absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 rounded-tr-lg`}
                            style={{
                              opacity: topRightImage ? 0 : 1,
                              borderColor: decorativeElementsColor,
                            }}
                          />
                          <div
                            className={`absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 rounded-bl-lg`}
                            style={{
                              opacity: bottomLeftImage ? 0 : 1,
                              borderColor: decorativeElementsColor,
                            }}
                          />
                          <div
                            className={`absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 rounded-br-lg`}
                            style={{
                              opacity: bottomRightImage ? 0 : 1,
                              borderColor: decorativeElementsColor,
                            }}
                          />
                        </>
                      )}

                      {/* Certificate Content */}
                      <div
                        className="relative z-10 h-full flex flex-col"
                        style={{
                          minHeight:
                            certificateStyle === "wide" ? "500px" : "auto",
                        }}
                      >
                        {/* Enhanced Decorative Header */}
                        <div className="text-center mb-4">
                          <div
                            className={`flex items-center justify-center mb-2 ${
                              certificateStyle === "wide" ? "mx-16" : "mx-8"
                            }`}
                          >
                            {/*left Title decorative elements */}
                            <Star
                              className="w-6 h-6"
                              style={{
                                color: decorativeElementsColor,
                                opacity: topLeftImage ? 0 : 1,
                              }}
                            />
                            <div
                              className="h-0.5 flex-1 mx-2 bg-gradient-to-r from-transparent to-transparent"
                              style={{
                                backgroundImage: `linear-gradient(to right, transparent, 
                      ${decorativeElementsColor}, transparent)`,
                                opacity: topLeftImage ? 0 : 1,
                              }}
                            />
                            {/* end left Title decorative elements */}
                            <Award
                              className="w-10 h-10"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            />
                            <h1
                              className={`font-bold tracking-wider ${
                                certificateStyle === "wide"
                                  ? "text-5xl"
                                  : "text-4xl"
                              }`}
                              style={{
                                color: mainTitleColor,
                                fontFamily: mainTitleFont,
                              }}
                            >
                              {mainTitle}
                            </h1>
                            <Award
                              className="w-10 h-10"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            />
                            {/*right Title decorative elements */}
                            <div
                              className="h-0.5 flex-1 mx-2 bg-gradient-to-r from-transparent to-transparent"
                              style={{
                                backgroundImage: `linear-gradient(to right, transparent, ${decorativeElementsColor}, transparent)`,
                                opacity: topRightImage ? 0 : 1,
                              }}
                            />

                            <Star
                              className="w-6 h-6"
                              style={{
                                color: decorativeElementsColor,
                                opacity: topRightImage ? 0 : 1,
                              }}
                            />
                          </div>
                          {/* end right Title decorative elements */}
                          <h2
                            className={`font-semibold mt-2 ${
                              certificateStyle === "wide"
                                ? "text-3xl"
                                : "text-2xl"
                            }`}
                            style={{
                              color: titleColor,
                              fontFamily: titleFont,
                            }}
                          >
                            {award.title}
                          </h2>
                        </div>

                        {/* Enhanced Recipient Section */}
                        <div className="text-center mb-4">
                          <p
                            className={`italic ${
                              certificateStyle === "wide"
                                ? "text-xl mt-14"
                                : "text-lg mt-8"
                            }`}
                            style={{
                              color: descriptionColor,
                            }}
                          >
                            {presentationText}
                          </p>
                          <div className="relative inline-block mt-2">
                            <p
                              className={`font-bold relative z-10 ${
                                certificateStyle === "wide"
                                  ? "text-4xl mt-10"
                                  : "text-3xl"
                              }`}
                              style={{
                                color: recipientColor,
                                fontFamily: recipientFont,
                              }}
                            >
                              {award.recipient}
                            </p>
                            <div
                              className="absolute -bottom-1 left-0 right-0 h-3 -rotate-1"
                              style={{
                                backgroundColor: `${ornamentalCornersColor}33`,
                              }}
                            />
                          </div>
                          {/* Enhanced Decorative Divider */}
                          <div
                            className={`flex items-center justify-center my-4 ${
                              certificateStyle === "wide" ? "mx-32" : "mx-16"
                            }`}
                          >
                            <Star
                              className="w-4 h-4"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            />
                            <div
                              className="h-px w-16 mx-2"
                              style={{
                                backgroundColor: decorativeElementsColor,
                              }}
                            />
                            <Medal
                              className="w-6 h-6"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            />
                            <div
                              className="mx-2 text-xl"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            >
                              ✦
                            </div>
                            <Medal
                              className="w-6 h-6"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            />
                            <div
                              className="h-px w-16 mx-2"
                              style={{
                                backgroundColor: decorativeElementsColor,
                              }}
                            />
                            <Star
                              className="w-4 h-4"
                              style={{
                                color: decorativeElementsColor,
                              }}
                            />
                          </div>
                        </div>

                        {/* Enhanced Description */}
                        <div className="text-center mb-6">
                          <p
                            className={`italic leading-relaxed ${
                              certificateStyle === "wide"
                                ? "text-xl"
                                : "text-base"
                            }`}
                            style={{
                              color: descriptionColor,
                              fontFamily: descriptionFont,
                            }}
                          >
                            {award.description}
                          </p>
                        </div>

                        {/* Enhanced Signatures with more bottom spacing */}
                        <div
                          className={`flex justify-between ${
                            certificateStyle === "wide"
                              ? "mx-24 mt-12 mb-4"
                              : "mx-12 mt-8 mb-2"
                          }`}
                        >
                          {signatories.map((signatory, index) => (
                            <div key={index} className="text-center">
                              <p
                                className={`font-semibold ${
                                  certificateStyle === "wide"
                                    ? "text-lg"
                                    : "text-base"
                                }`}
                                style={{
                                  color: signatoryColor,
                                  fontFamily: signatoryFont,
                                }}
                              >
                                {signatory.name}
                              </p>
                              <div
                                className={`w-32 border-t-2 my-1 ${
                                  certificateStyle === "wide" ? "mx-16" : "mx-8"
                                }`}
                                style={{
                                  borderColor: decorativeElementsColor,
                                }}
                              />
                              <p
                                className={
                                  certificateStyle === "wide"
                                    ? "text-base"
                                    : "text-sm"
                                }
                                style={{
                                  color: signatoryColor,
                                  fontFamily: signatoryFont,
                                }}
                              >
                                {signatory.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
