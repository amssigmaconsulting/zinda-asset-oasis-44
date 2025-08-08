import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  property_type: z.string().min(1, "Please select a property type"),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  square_feet: z.string().optional(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  fuel_type: z.string().optional(),
  condition: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type ListingFormData = z.infer<typeof listingSchema>;

const EditListing = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [listingType, setListingType] = useState<"real-estate" | "automobile">("real-estate");
  const [listingPurpose, setListingPurpose] = useState<"sale" | "rent">("sale");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      square_feet: "",
      year: "",
      mileage: "",
      fuel_type: "",
      condition: "",
      make: "",
      model: "",
      images: [],
    },
  });

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data: listing, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load listing",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      // Check if current user owns this listing
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || listing.user_id !== user.id) {
        toast({
          title: "Access Denied",
          description: "You can only edit your own listings",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      // Populate form with existing data
      form.setValue("title", listing.title);
      form.setValue("description", listing.description || "");
      form.setValue("property_type", listing.property_type);
      form.setValue("price", listing.price.toString());
      form.setValue("location", listing.location);
      form.setValue("bedrooms", listing.bedrooms?.toString() || "");
      form.setValue("bathrooms", listing.bathrooms?.toString() || "");
      form.setValue("square_feet", listing.square_feet?.toString() || "");
      form.setValue("year", listing.year?.toString() || "");
      form.setValue("mileage", listing.mileage || "");
      form.setValue("fuel_type", listing.fuel_type || "");
      form.setValue("condition", listing.condition || "");
      form.setValue("make", listing.make || "");
      form.setValue("model", listing.model || "");
      
      setUploadedImages(listing.images || []);
      form.setValue("images", listing.images || []);
      setListingPurpose(listing.listing_purpose as "sale" | "rent");
      
      // Determine listing type based on property_type
      const automobileTypes = ["sedan", "suv", "truck", "coupe", "convertible", "hatchback", "wagon", "motorcycle"];
      if (automobileTypes.includes(listing.property_type)) {
        setListingType("automobile");
      } else {
        setListingType("real-estate");
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast({
        title: "Error",
        description: "Failed to load listing",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newImageUrls: string[] = [];

      newFiles.forEach((file) => {
        const previewUrl = URL.createObjectURL(file);
        newImageUrls.push(previewUrl);
      });

      setImageFiles([...imageFiles, ...newFiles]);
      setUploadedImages([...uploadedImages, ...newImageUrls]);
      form.setValue("images", [...uploadedImages, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    
    if (uploadedImages[index].startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImages[index]);
    }
    
    setUploadedImages(newImages);
    setImageFiles(newFiles);
    form.setValue("images", newImages);
  };

  const uploadImageToSupabase = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to edit listings.",
          variant: "destructive",
        });
        navigate("/sell");
        return;
      }

      // Upload new images to Supabase Storage
      const finalImageUrls: string[] = [];
      
      // Keep existing images (non-blob URLs)
      const existingImages = uploadedImages.filter(url => !url.startsWith('blob:'));
      finalImageUrls.push(...existingImages);
      
      // Upload new images (blob URLs)
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${user.id}/${Date.now()}-${i}-${file.name}`;
        const imageUrl = await uploadImageToSupabase(file, fileName);
        
        if (imageUrl) {
          finalImageUrls.push(imageUrl);
        }
      }

      if (finalImageUrls.length === 0) {
        toast({
          title: "Image Upload Failed",
          description: "Please ensure you have at least one image.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Update the listing in the database
      const { error } = await supabase
        .from('property_listings')
        .update({
          title: data.title,
          description: data.description,
          property_type: data.property_type,
          price: parseFloat(data.price.replace(/[^0-9.]/g, '')),
          location: data.location,
          bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
          bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
          square_feet: data.square_feet ? parseInt(data.square_feet) : null,
          year: data.year ? parseInt(data.year) : null,
          mileage: data.mileage || null,
          fuel_type: data.fuel_type || null,
          condition: data.condition || null,
          make: data.make || null,
          model: data.model || null,
          images: finalImageUrls,
          listing_purpose: listingPurpose,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating listing:', error);
        toast({
          title: "Error Updating Listing",
          description: "There was an error updating your listing. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Listing Updated Successfully!",
        description: "Your listing has been updated.",
      });

      // Clean up object URLs
      uploadedImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: "Error Updating Listing",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const realEstateCategories = [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" },
  ];

  const automobileCategories = [
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "truck", label: "Truck" },
    { value: "coupe", label: "Coupe" },
    { value: "convertible", label: "Convertible" },
    { value: "hatchback", label: "Hatchback" },
    { value: "wagon", label: "Wagon" },
    { value: "motorcycle", label: "Motorcycle" },
  ];

  const fuelTypes = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const conditions = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading listing...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="ghost" size="sm" asChild className="self-start">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Listing</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Update your property listing</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <Tabs defaultValue="basic" className="space-y-4 sm:space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="details">Details & Pricing</TabsTrigger>
                  <TabsTrigger value="images">Images & Review</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Update the essential details about your listing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a descriptive title for your listing" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your property in detail..."
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="property_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{listingType === "automobile" ? "Vehicle Type" : "Property Type"}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select a ${listingType === "automobile" ? "vehicle" : "property"} type`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(listingType === "automobile" ? automobileCategories : realEstateCategories).map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Details & Pricing</CardTitle>
                      <CardDescription>Add specific details and set your price</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {listingType === "real-estate" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bedrooms</FormLabel>
                                <FormControl>
                                  <Input placeholder="2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bathrooms</FormLabel>
                                <FormControl>
                                  <Input placeholder="2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="square_feet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Square Feet</FormLabel>
                                <FormControl>
                                  <Input placeholder="1500" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {listingType === "automobile" && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="make"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Make</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Toyota" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="model"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Model</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Camry" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="year"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input placeholder="2020" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mileage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mileage</FormLabel>
                                  <FormControl>
                                    <Input placeholder="50,000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="fuel_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fuel Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select fuel type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {fuelTypes.map((fuel) => (
                                        <SelectItem key={fuel.value} value={fuel.value}>
                                          {fuel.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="condition"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Condition</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {conditions.map((condition) => (
                                        <SelectItem key={condition.value} value={condition.value}>
                                          {condition.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Images</CardTitle>
                      <CardDescription>Update your listing images</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="text-center">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Add Image</span>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Update Listing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
