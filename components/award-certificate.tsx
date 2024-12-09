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
  Image,
  Type,
  Award as AwardIcon,
  UserSquare,
  Palette,
  Download,
  Settings2
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Signatory {
  name: string;
  title: string;
}

interface Award {
  recipient: string;
  title: string;
  description: string;
}

const initialAwards: Award[] = [
  {
    recipient: "John Doe",
    title: "Outstanding Achievement in Science",
    description: "For exceptional performance in the annual science fair"
  },
  {
    recipient: "Jane Smith",
    title: "Excellence in Leadership",
    description:
      "For demonstrating remarkable leadership skills in group projects"
  }
];

const initialSignatories: Signatory[] = [
  { name: "Emma Davis", title: "Principal" },
  { name: "Robert Wilson", title: "Program Coordinator" },
  { name: "Lisa Thompson", title: "Head Teacher" }
];

export default function AwardCertificate() {
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [signatories, setSignatories] =
    useState<Signatory[]>(initialSignatories);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [topRightImage, setTopRightImage] = useState<string | null>(null);
  const [topLeftImage, setTopLeftImage] = useState<string | null>(null);
  const [bottomRightImage, setBottomRightImage] = useState<string | null>(null);
  const [bottomLeftImage, setBottomLeftImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  const [cornerOpacity, setCornerOpacity] = useState(0.2);
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

  const [newAward, setNewAward] = useState<Award>({
    recipient: "",
    title: "",
    description: ""
  });
  const [newSignatory, setNewSignatory] = useState<Signatory>({
    name: "",
    title: ""
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

  const exportToPDF = async () => {
    const pdf = new jsPDF({
      orientation: certificateStyle === "wide" ? "landscape" : "portrait",
      unit: "in",
      format: certificateStyle === "wide" ? [14, 8.5] : [8.5, 11]
    });

    const margin = 0.5; // Reduced margin to 0.5 inch
    const pageWidth = certificateStyle === "wide" ? 11 : 8.5;
    const pageHeight = certificateStyle === "wide" ? 8.5 : 11;
    const usableWidth = pageWidth - 2 * margin;

    for (let i = 0; i < awards.length; i++) {
      // Only add new page if we're in landscape mode or if we're starting a new pair in portrait
      if (i > 0 && (certificateStyle === "wide" || i % 2 === 0)) {
        pdf.addPage();
      }

      const certificate = certificatesRef.current[i];
      if (certificate) {
        const canvas = await html2canvas(certificate, {
          scale: 2,
          logging: false,
          useCORS: true
        });

        // Calculate dimensions based on 3:2 aspect ratio
        let imgWidth, imgHeight, yPosition;
        if (certificateStyle === "wide") {
          // 3:2 aspect ratio for wide
          imgWidth = usableWidth;
          imgHeight = usableWidth * (2 / 3);
          yPosition = (pageHeight - imgHeight) / 2;
        } else {
          // 3:2 aspect ratio for portrait
          imgWidth = usableWidth;
          imgHeight = usableWidth * (2 / 3);
          const verticalGap = 0.25; // Reduced gap between certificates
          yPosition = (i % 2) * (imgHeight + verticalGap) + margin;
        }

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
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

          <Tabs defaultValue="images" className="w-full">
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
                  <Image className="w-4 h-4" />
                  <span className="text-sm font-medium">Images</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="fonts"
                className="bg-white data-[state=active]:bg-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center gap-2 py-3 px-2">
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-medium">Fonts</span>
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
                  <span className="text-sm font-medium">Export</span>
                </div>
              </TabsTrigger>
            </TabsList>

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
                            <Input
                              id="presentationText"
                              type="text"
                              value={presentationText}
                              onChange={(e) =>
                                setPresentationText(e.target.value)
                              }
                              placeholder="Enter presentation text"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips Card */}
                    <div className="space-y-4">
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
                            • Presentation text appears above recipient's name
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
                    <Image className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Upload Images
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <label className="text-base">For Background : </label>
                          <FileUpload
                            onFileSelect={handleBackgroundUpload}
                            label="Background"
                          />
                          <label className="text-base">
                            For Corner Images :{" "}
                          </label>
                          <label className="text-sm">Top Left : </label>
                          <FileUpload
                            onFileSelect={handleTopLeftUpload}
                            label="Top Left"
                          />
                          <label className="text-sm">Top Right : </label>
                          <FileUpload
                            onFileSelect={handleTopRightUpload}
                            label="Top Right"
                          />
                          <label className="text-sm">Bottom Left : </label>
                          <FileUpload
                            onFileSelect={handleBottomLeftUpload}
                            label="Bottom Left"
                          />
                          <label className="text-sm">Bottom Right : </label>
                          <FileUpload
                            onFileSelect={handleBottomRightUpload}
                            label="Bottom Right"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Opacity Controls */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Opacity Settings
                        </h3>
                        <div className="space-y-6">
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
                                htmlFor="cornerOpacity"
                                className="text-sm"
                              >
                                Corner Images Opacity
                              </Label>
                              <span className="text-sm text-gray-500">
                                {(cornerOpacity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Input
                              id="cornerOpacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={cornerOpacity}
                              onChange={(e) =>
                                setCornerOpacity(parseFloat(e.target.value))
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

              <TabsContent value="fonts" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Font Settings
                      </h2>
                      <p className="text-sm text-gray-500">
                        Customize text colors and styles
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
                              setter: setMainTitleColor
                            },
                            {
                              id: "titleColor",
                              label: "Title",
                              value: titleColor,
                              setter: setTitleColor
                            },
                            {
                              id: "recipientColor",
                              label: "Recipient",
                              value: recipientColor,
                              setter: setRecipientColor
                            },
                            {
                              id: "descriptionColor",
                              label: "Description",
                              value: descriptionColor,
                              setter: setDescriptionColor
                            },
                            {
                              id: "signatoryColor",
                              label: "Signatory",
                              value: signatoryColor,
                              setter: setSignatoryColor
                            }
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
                              setter: setDecorativeElementsColor
                            },
                            {
                              id: "ornamentalCornersColor",
                              label: "Ornamental Corners",
                              value: ornamentalCornersColor,
                              setter: setOrnamentalCornersColor
                            }
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
                                  title: e.target.value
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
                                  recipient: e.target.value
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
                                  description: e.target.value
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
                                  name: e.target.value
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
                                  title: e.target.value
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
                        Export Options
                      </h2>
                      <p className="text-sm text-gray-500">
                        Download certificates as PDF
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={exportToPDF}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export to PDF
                    </Button>
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
                    className={`relative bg-white border-8 rounded-lg shadow-2xl p-8 pb-16 aspect-[3/2]`}
                    style={{ borderColor: ornamentalCornersColor }}
                  >
                    {/* Background Image */}
                    {backgroundImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${backgroundImage})`,
                          opacity: backgroundOpacity
                        }}
                      />
                    )}
                    {/* Corner Images */}
                    {topLeftImage && (
                      <div
                        className="absolute top-4 left-4 w-24 h-24 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${topLeftImage})`,
                          opacity: cornerOpacity
                        }}
                      />
                    )}
                    {topRightImage && (
                      <div
                        className="absolute top-4 right-4 w-24 h-24 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${topRightImage})`,
                          opacity: cornerOpacity
                        }}
                      />
                    )}
                    {bottomLeftImage && (
                      <div
                        className="absolute bottom-4 left-4 w-24 h-24 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${bottomLeftImage})`,
                          opacity: cornerOpacity
                        }}
                      />
                    )}
                    {bottomRightImage && (
                      <div
                        className="absolute bottom-4 right-4 w-24 h-24 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${bottomRightImage})`,
                          opacity: cornerOpacity
                        }}
                      />
                    )}

                    {/* Decorative Elements */}
                    <div
                      className="absolute -top-1 -left-1 z-10"
                      style={{ color: decorativeElementsColor }}
                    >
                      <Medal
                        className="w-6 h-6"
                        fill={decorativeElementsColor}
                        fillOpacity={0.4}
                      />
                    </div>
                    <div
                      className="absolute -top-1 -right-1 z-10"
                      style={{ color: decorativeElementsColor }}
                    >
                      <Medal
                        className="w-6 h-6"
                        fill={decorativeElementsColor}
                        fillOpacity={0.4}
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -left-1 z-10"
                      style={{ color: decorativeElementsColor }}
                    >
                      <Ribbon
                        className="w-6 h-6"
                        fill={decorativeElementsColor}
                        fillOpacity={0.4}
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 z-10"
                      style={{ color: decorativeElementsColor }}
                    >
                      <Ribbon
                        className="w-6 h-6"
                        fill={decorativeElementsColor}
                        fillOpacity={0.4}
                      />
                    </div>

                    {/* Ornamental Corners with fixed alignment */}
                    <div className="absolute inset-0">
                      {/* Gold borders */}
                      <div
                        className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 rounded-tl-lg"
                        style={{ borderColor: ornamentalCornersColor }}
                      />
                      <div
                        className="absolute top-0 right-0 w-24 h-24 border-r-4 border-t-4 rounded-tr-lg"
                        style={{ borderColor: ornamentalCornersColor }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 rounded-bl-lg"
                        style={{ borderColor: ornamentalCornersColor }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 rounded-br-lg"
                        style={{ borderColor: ornamentalCornersColor }}
                      />

                      {/* Brown borders positioned below gold */}
                      <div
                        className={`absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-[${decorativeElementsColor}] rounded-tl-lg`}
                        style={{ opacity: topLeftImage ? 0 : 1 }}
                      />
                      <div
                        className={`absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-[${decorativeElementsColor}] rounded-tr-lg`}
                        style={{ opacity: topRightImage ? 0 : 1 }}
                      />
                      <div
                        className={`absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-[${decorativeElementsColor}] rounded-bl-lg`}
                        style={{ opacity: bottomLeftImage ? 0 : 1 }}
                      />
                      <div
                        className={`absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-[${decorativeElementsColor}] rounded-br-lg`}
                        style={{ opacity: bottomRightImage ? 0 : 1 }}
                      />
                    </div>

                    {/* Certificate Content */}
                    <div
                      className="relative z-10 h-full flex flex-col"
                      style={{
                        minHeight:
                          certificateStyle === "wide" ? "500px" : "auto"
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
                              opacity: topLeftImage ? 0 : 1
                            }}
                          />
                          <div
                            className="h-0.5 flex-1 mx-2 bg-gradient-to-r from-transparent to-transparent"
                            style={{
                              backgroundImage: `linear-gradient(to right, transparent, 
                      ${decorativeElementsColor}, transparent)`,
                              opacity: topLeftImage ? 0 : 1
                            }}
                          />
                          {/* end left Title decorative elements */}
                          <Award
                            className="w-10 h-10"
                            style={{ color: decorativeElementsColor }}
                          />
                          <h1
                            className={`mx-2 font-bold font-serif tracking-wider ${
                              certificateStyle === "wide"
                                ? "text-5xl mt-6"
                                : "text-4xl"
                            }`}
                            style={{ color: mainTitleColor }}
                          >
                            {mainTitle}
                          </h1>
                          <Award
                            className="w-10 h-10"
                            style={{ color: decorativeElementsColor }}
                          />
                          {/*right Title decorative elements */}
                          <div
                            className="h-0.5 flex-1 mx-2 bg-gradient-to-r from-transparent to-transparent"
                            style={{
                              backgroundImage: `linear-gradient(to right, transparent, ${decorativeElementsColor}, transparent)`
                            }}
                          />

                          <Star
                            className="w-6 h-6"
                            style={{ color: decorativeElementsColor }}
                          />
                        </div>
                        {/* end right Title decorative elements */}
                        <h2
                          className={`font-semibold font-serif mt-2 ${
                            certificateStyle === "wide"
                              ? "text-3xl"
                              : "text-2xl"
                          }`}
                          style={{ color: titleColor }}
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
                          style={{ color: descriptionColor }}
                        >
                          {presentationText}
                        </p>
                        <div className="relative inline-block mt-2">
                          <p
                            className={`font-bold font-serif relative z-10 ${
                              certificateStyle === "wide"
                                ? "text-4xl mt-10"
                                : "text-3xl"
                            }`}
                            style={{ color: recipientColor }}
                          >
                            {award.recipient}
                          </p>
                          <div className="absolute -bottom-1 left-0 right-0 h-3 bg-[#d4af37]/10 -rotate-1" />
                        </div>
                        {/* Enhanced Decorative Divider */}
                        <div
                          className={`flex items-center justify-center my-4 ${
                            certificateStyle === "wide" ? "mx-32" : "mx-16"
                          }`}
                        >
                          <Star
                            className="w-4 h-4"
                            style={{ color: decorativeElementsColor }}
                          />
                          <div
                            className="h-px w-16 mx-2"
                            style={{ backgroundColor: decorativeElementsColor }}
                          />
                          <Medal
                            className="w-6 h-6"
                            style={{ color: decorativeElementsColor }}
                          />
                          <div
                            className="mx-2 text-xl"
                            style={{ color: decorativeElementsColor }}
                          >
                            ✦
                          </div>
                          <Medal
                            className="w-6 h-6"
                            style={{ color: decorativeElementsColor }}
                          />
                          <div
                            className="h-px w-16 mx-2"
                            style={{ backgroundColor: decorativeElementsColor }}
                          />
                          <Star
                            className="w-4 h-4"
                            style={{ color: decorativeElementsColor }}
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
                          style={{ color: descriptionColor }}
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
                              style={{ color: signatoryColor }}
                            >
                              {signatory.name}
                            </p>
                            <div
                              className="w-32 border-t-2 my-1"
                              style={{ borderColor: decorativeElementsColor }}
                            />
                            <p
                              className={
                                certificateStyle === "wide"
                                  ? "text-base"
                                  : "text-sm"
                              }
                              style={{ color: signatoryColor }}
                            >
                              {signatory.title}
                            </p>
                          </div>
                        ))}
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
