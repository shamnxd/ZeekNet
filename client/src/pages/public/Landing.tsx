import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicFooter from "@/components/layouts/PublicFooter";
import { useAppSelector } from "@/hooks/useRedux";
import { UserRole } from "@/constants/enums";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Award,
  MessageCircle,
} from "lucide-react";
import PublicHeader from "@/components/layouts/PublicHeader";
import { useState, useEffect } from "react";
import { jobApi } from "@/api/job.api";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const [featuredJobs, setFeaturedJobs] = useState<JobPostingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobApi.getFeaturedJobs({ limit: 6 });
        if (response.success && response.data) {
          setFeaturedJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const companiesLogo = [
    {
      name: "Framer",
      logo: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/framer.svg",
    },
    {
      name: "Facebook",
      logo: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/facebook.svg",
    },
    {
      name: "Instagram",
      logo: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/instagram.svg",
    },
    {
      name: "Linkedin",
      logo: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/linkedin.svg",
    },
    {
      name: "Googl",
      logo: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/google.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-poppins">
      <section className="flex flex-col items-center text-sm bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
        <PublicHeader />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            .font-poppins {
                font-family: 'Poppins', sans-serif;
            }
        `}
        </style>
        <main className="container max-w-[1440px] mx-auto px-4 lg:px-16 flex flex-col items-center pb-12 sm:pb-20">
          <div className="flex flex-wrap items-center justify-center p-1 rounded-full bg-white border border-gray-300 text-xs sm:text-sm mt-6 sm:mt-10">
            <div className="flex items-center">
              <img
                className="w-[24px] sm:w-[30px] rounded-full border-2 sm:border-3 border-white"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                alt="userImage1"
              />
              <img
                className="w-[24px] sm:w-[30px] rounded-full border-2 sm:border-3 border-white -translate-x-1 sm:-translate-x-2"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                alt="userImage2"
              />
              <img
                className="w-[24px] sm:w-[30px] rounded-full border-2 sm:border-3 border-white -translate-x-2 sm:-translate-x-4"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                alt="userImage3"
              />
            </div>
            <p className="-translate-x-1 sm:-translate-x-2">Trusted by 10,000+ people</p>
          </div>

          <h1 className="text-center text-3xl leading-[40px] sm:text-4xl sm:leading-[50px] md:text-5xl md:leading-[60px] lg:text-6xl lg:leading-[80px] font-semibold max-w-4xl text-slate-900 mt-4 sm:mt-6">
            Find your dream job faster with{" "}
            <span className="text-primary">ZeekNet</span>
          </h1>
          <p className="text-center text-sm sm:text-base text-slate-700 max-w-lg mt-3 sm:mt-4 px-2">
            The most reliable job portal. Connect with top companies and build
            your career with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-2 sm:px-0">
            <Link
              to="/jobs"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white active:scale-95 rounded-lg px-6 sm:px-7 h-11 transition-all w-full sm:w-auto"
            >
              Find Jobs
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              to="/auth/register"
              className="flex items-center justify-center border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-lg px-6 sm:px-8 h-11 w-full sm:w-auto"
            >
              Post a Job
            </Link>
          </div>
          <h3 className="text-sm sm:text-base text-center text-slate-400 pb-8 sm:pb-14 pt-8 sm:pt-14 font-medium px-2">
            Trusting by leading brands, including.
          </h3>
          <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
            <div className="absolute left-0 top-0 h-full w-12 sm:w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

            <div className="flex marquee-inner will-change-transform max-w-5xl mx-auto">
              {[...companiesLogo, ...companiesLogo].map((company, index) => (
                <img
                  key={index}
                  className="mx-6 sm:mx-11 h-8 sm:h-10 w-auto grayscale opacity-60 hover:opacity-100 transition-all duration-300"
                  src={company.logo}
                  alt={company.name}
                />
              ))}
            </div>

            <div className="absolute right-0 top-0 h-full w-12 sm:w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
          </div>
        </main>
      </section>

      <section className="py-12 sm:py-20 bg-primary/5">
        <div className="container max-w-[1440px] mx-auto px-4 lg:px-16">
          <div className="text-center mb-12 sm:mb-16 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Featured Jobs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Discover the best job opportunities from top companies
            </p>
            <div className="absolute right-6 sm:right-10 top-0 w-6 sm:w-8 h-6 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <div className="text-primary text-lg sm:text-xl">+</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-card border border-border">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Skeleton className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg" />
                      <Skeleton className="w-16 sm:w-20 h-5 sm:h-6" />
                    </div>
                    <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
                    <Skeleton className="h-3 sm:h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 sm:h-4 w-1/3 mb-4" />
                    <Skeleton className="h-9 sm:h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 bg-card border border-border group hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-gray-200/50 group-hover:shadow-xl group-hover:shadow-gray-200/70 transition-all duration-300 overflow-hidden flex-shrink-0">
                        {job.companyLogo || job.company?.logo ? (
                          <img
                            src={job.companyLogo || job.company?.logo}
                            alt={job.companyName || job.company?.companyName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm sm:text-base">
                            {(job.companyName || job.company?.companyName || "C")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground shadow-sm text-xs sm:text-sm"
                      >
                        {(job.employmentTypes && job.employmentTypes[0]) ||
                          (job.employment_types && job.employment_types[0]) ||
                          "Full-time"}
                      </Badge>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-primary font-medium mb-2 truncate text-sm sm:text-base">
                      {job.companyName || job.company?.companyName}
                    </p>
                    <div className="flex flex-col gap-1 mb-4">
                      <p className="text-muted-foreground text-xs sm:text-sm flex items-center">
                        <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{job.location || "Remote"}</span>
                      </p>
                      {job.salary && (
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                          ${job.salary.min.toLocaleString()} - $
                          {job.salary.max.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base h-9 sm:h-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 sm:py-10 text-muted-foreground text-sm sm:text-base">
                No featured jobs found at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-background">
        <div className="container max-w-[1440px] mx-auto px-4 lg:px-16">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
              Search desired job by categories
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Find opportunities in your field of expertise
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {[
              "Accounting",
              "Creative",
              "Development",
              "Marketing",
              "Legal",
              "Commercial",
              "Business",
              "Finance",
            ].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-xs sm:text-sm h-9 sm:h-10"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-primary/5">
        <div className="container max-w-[1440px] mx-auto px-4 lg:px-16">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 px-2">
              What our clients say
            </h2>
            <Button
              variant="outline"
              className="mt-4 bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                rating: 5,
                text: "Amazing platform! Found my dream job within a week. The interface is user-friendly and the job recommendations are spot on.",
                author: "Sarah Johnson",
                role: "Software Engineer",
              },
              {
                rating: 5,
                text: "As an employer, this platform has been incredible for finding top talent. The quality of candidates is exceptional.",
                author: "Mike Chen",
                role: "HR Director",
              },
              {
                rating: 5,
                text: "The best job portal I've used. Great filtering options and excellent customer support throughout the process.",
                author: "Emily Davis",
                role: "Marketing Manager",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-[1.02]"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 sm:w-5 h-4 sm:h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 text-pretty text-sm sm:text-base">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                      <Users className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        {testimonial.author}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-background">
        <div className="container max-w-[1440px] mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                We Have the largest job Network all over the world
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-pretty text-sm sm:text-base">
                Connect with millions of job seekers and thousands of companies
                worldwide. Our platform has helped countless professionals find
                their perfect career match.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm sm:text-base">
                    Over 2 million active job seekers
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm sm:text-base">
                    50,000+ companies trust our platform
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm sm:text-base">
                    Available in 150+ countries worldwide
                  </span>
                </div>
              </div>
              <Button className="mt-6 sm:mt-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base">
                Learn More
              </Button>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                    +102
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Job Categories
                  </div>
                </Card>
                <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                    2M+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Active Users
                  </div>
                </Card>
                <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                    50K+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Companies</div>
                </Card>
                <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Success Rate
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container max-w-[1440px] mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center p-6 sm:p-8 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-[1.02]">
              <TrendingUp className="w-10 sm:w-12 h-10 sm:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                Recruiting?
              </h3>
              <p className="text-muted-foreground mb-6 text-pretty text-sm sm:text-base">
                Find the best talent for your company with our advanced
                recruiting tools.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base">
                Start Recruiting
              </Button>
            </Card>
            <Card className="text-center p-6 sm:p-8 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-[1.02]">
              <Globe className="w-10 sm:w-12 h-10 sm:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                Looking for Job?
              </h3>
              <p className="text-muted-foreground mb-6 text-pretty text-sm sm:text-base">
                Discover thousands of job opportunities that match your skills
                and experience.
              </p>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base"
                asChild
              >
                <a href="/jobs">Find Jobs</a>
              </Button>
            </Card>
            <Card className="text-center p-6 sm:p-8 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-[1.02]">
              <Award className="w-10 sm:w-12 h-10 sm:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                King Expert
              </h3>
              <p className="text-muted-foreground mb-6 text-pretty text-sm sm:text-base">
                Join our expert network and showcase your skills to top
                companies worldwide.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base">
                Become Expert
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-background">
        <div className="container max-w-[1440px] mx-auto px-4 lg:px-16">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 px-2">
              Recent Articles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                image: "/person-typing.png",
                title: "10 Tips to Improve Your Resume and Land Your Dream Job",
                excerpt:
                  "Learn the essential strategies to make your resume stand out from the competition.",
                date: "Dec 15, 2024",
              },
              {
                image: "/business-meeting-office.png",
                title: "How to Ace Your Next Job Interview: A Complete Guide",
                excerpt:
                  "Master the art of interviewing with these proven techniques and strategies.",
                date: "Dec 12, 2024",
              },
              {
                image: "/remote-work-setup.png",
                title: "The Future of Remote Work: Trends and Opportunities",
                excerpt:
                  "Explore the evolving landscape of remote work and how to thrive in it.",
                date: "Dec 10, 2024",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:scale-[1.02]"
              >
                <div className="aspect-video bg-muted"></div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-balance">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-4 text-pretty">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {article.date}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs sm:text-sm"
                    >
                      Read More <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <Button
              variant="outline"
              className="px-6 sm:px-8 bg-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm sm:text-base"
            >
              View More
            </Button>
          </div>
        </div>
      </section>

      {isAuthenticated && role !== UserRole.ADMIN && (
        <Link
          to={role === UserRole.SEEKER ? "/seeker/messages" : "/company/messages"}
          className="fixed bottom-8 right-8 z-50 group"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-75 duration-[2s]" />
            <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-white/20">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Messages
              </p>
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white/90 dark:bg-slate-800/90 border-r border-t border-slate-200 dark:border-slate-700 rotate-45 transform" />
            </div>
          </div>
        </Link>
      )}

      <PublicFooter />
    </div>
  );
};

export default Landing;
