"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle, 
  ChevronDown, 
  Plane, 
  Package, 
  CreditCard, 
  Shield, 
  Users,
  ArrowRight,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "General",
    icon: HelpCircle,
    questions: [
      {
        q: "What is JastipKu?",
        a: "JastipKu is a platform that connects travelers (jastipers) with people who want to buy products from abroad. Jastipers traveling internationally can purchase items for others and earn a commission while helping shoppers access products not available locally."
      },
      {
        q: "How does JastipKu work?",
        a: "1. Browse trips from jastipers traveling to your desired country. 2. Request items you want through the order system. 3. Jastiper purchases your items and provides updates. 4. Items are shipped to your address. 5. Confirm receipt and leave a review."
      },
      {
        q: "Is JastipKu free to use?",
        a: "Yes! Creating an account and browsing trips is completely free. Jastipers only pay a small service fee when they successfully complete an order, which is already included in the pricing shown to shoppers."
      },
    ]
  },
  {
    category: "For Shoppers",
    icon: Users,
    questions: [
      {
        q: "How do I place an order?",
        a: "Find a trip to your desired country, browse the jastiper's details, and click 'Request Order'. Fill in the items you want with details like product name, quantity, and any specific requirements. The jastiper will review and confirm your request."
      },
      {
        q: "How do payments work?",
        a: "Payments are held securely in escrow until you confirm receipt of your items. This protects both shoppers and jastipers. We accept various payment methods including bank transfer, e-wallets, and credit cards."
      },
      {
        q: "What if my items arrive damaged?",
        a: "Contact the jastiper immediately through our messaging system. If the issue isn't resolved, our support team will mediate. All orders are protected by our Buyer Protection guarantee."
      },
      {
        q: "How long does delivery take?",
        a: "Delivery time depends on the jastiper's travel schedule and shipping method. Typically, domestic shipping within Indonesia takes 3-7 business days after the jastiper returns. International trips vary based on destination."
      },
    ]
  },
  {
    category: "For Jastipers",
    icon: Plane,
    questions: [
      {
        q: "How do I become a jastiper?",
        a: "Sign up for an account, complete your profile with verification documents, and create a trip listing with your travel details. Once approved, you can start receiving order requests from shoppers."
      },
      {
        q: "How much can I earn?",
        a: "Earnings vary based on your trip destination, the number of orders you accept, and your commission rate. Most jastipers earn enough to cover their travel expenses, with some making it a significant side income."
      },
      {
        q: "What are my responsibilities as a jastiper?",
        a: "As a jastiper, you're responsible for: purchasing requested items, providing regular updates, properly packaging items, shipping to buyers' addresses, and communicating promptly with shoppers."
      },
      {
        q: "What if I can't find a requested item?",
        a: "Communicate with the shopper immediately. They can request a refund for that item, suggest an alternative, or you can try other stores. Clear communication is key to a successful jastip experience."
      },
    ]
  },
  {
    category: "Payments & Security",
    icon: Shield,
    questions: [
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers and is processed through PCI-DSS compliant partners."
      },
      {
        q: "When does the jastiper receive payment?",
        a: "Jastipers receive payment 3 business days after the shopper confirms delivery. This protection period ensures shoppers receive their items as expected before funds are released."
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept bank transfers (BCA, Mandiri, BNI, BRI), e-wallets (GoPay, OVO, Dana, ShopeePay), credit/debit cards, and convenience store payments (Alfamart, Indomaret)."
      },
    ]
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...faqs.map(f => f.category)];

  const filteredFaqs = faqs
    .filter(faq => selectedCategory === "all" || faq.category === selectedCategory)
    .map(faq => ({
      ...faq,
      questions: faq.questions.filter(
        q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
             q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(faq => faq.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="px-4 py-2 text-sm mb-2">
              <HelpCircle className="h-3 w-3 mr-1" />
              FAQ
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                {" "}Questions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about JastipKu
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for answers..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary" : ""}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFaqs.map((faq, categoryIndex) => {
            const Icon = faq.icon;
            return (
              <div key={faq.category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{faq.category}</h2>
                </div>

                <div className="space-y-3">
                  {faq.questions.map((item, questionIndex) => {
                    const globalIndex = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <Card 
                        key={globalIndex} 
                        className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                      >
                        <CardContent className="p-0">
                          <button
                            className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          >
                            <span className="font-semibold text-lg pr-8">{item.q}</span>
                            <ChevronDown 
                              className={`h-5 w-5 text-primary transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          <div 
                            className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                          >
                            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                              {item.a}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-12 pb-12 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search query or browse all categories.
                  </p>
                </div>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} variant="outline">
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Still have questions?
            </h2>
            <p className="text-lg text-muted-foreground">
              Our support team is here to help you with any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                <Link href="/contact">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/trips">Browse Trips</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
