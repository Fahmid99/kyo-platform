import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import {
  TrendingUp,
  Description,
  CloudUpload,
  Receipt,
  AttachMoney,
  Speed,
  DocumentScanner,
  Error,
  PictureAsPdf,
  Assignment,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

// Mock data specific to document scanning service
const scanningStats = [
  {
    title: "Documents Scanned",
    value: "1,247",
    change: "+18%",
    trend: "up",
    icon: <DocumentScanner />,
    color: "#1976d2",
    subtitle: "This month",
  },
  {
    title: "API Calls",
    value: "8,932",
    change: "+24%",
    trend: "up",
    icon: <CloudUpload />,
    color: "#2e7d32",
    subtitle: "Azure AI calls",
  },
  {
    title: "Monthly Cost",
    value: "$127.45",
    change: "+5.2%",
    trend: "up",
    icon: <AttachMoney />,
    color: "#ed6c02",
    subtitle: "Azure billing",
  },
  {
    title: "Success Rate",
    value: "98.7%",
    change: "+0.3%",
    trend: "up",
    icon: <Speed />,
    color: "#9c27b0",
    subtitle: "Processing accuracy",
  },
];

const recentScans = [
  {
    id: 1,
    title: "Invoice processed successfully",
    description: "invoice_2024_001.pdf - Extracted 12 fields",
    time: "2 minutes ago",
    type: "success",
    icon: <Receipt />,
    documentType: "Invoice",
  },
  {
    id: 2,
    title: "Business card scanned",
    description: "contact_card.jpg - Contact info extracted",
    time: "15 minutes ago",
    type: "success",
    icon: <Assignment />,
    documentType: "Business Card",
  },
  {
    id: 3,
    title: "Document processing failed",
    description: "receipt_scan.png - Low image quality",
    time: "1 hour ago",
    type: "error",
    icon: <Error />,
    documentType: "Receipt",
  },
  {
    id: 4,
    title: "Batch processing completed",
    description: "15 invoices processed in batch_042",
    time: "2 hours ago",
    type: "success",
    icon: <PictureAsPdf />,
    documentType: "Batch",
  },
  {
    id: 5,
    title: "Form analysis completed",
    description: "tax_form_2024.pdf - All fields extracted",
    time: "3 hours ago",
    type: "success",
    icon: <Description />,
    documentType: "Tax Form",
  },
];

const azureServices = [
  { name: "Document Intelligence", usage: 85, cost: "$67.20", calls: "3,247" },
  { name: "Form Recognizer", usage: 62, cost: "$34.15", calls: "1,892" },
  { name: "Computer Vision", usage: 45, cost: "$18.90", calls: "987" },
  { name: "Text Analytics", usage: 78, cost: "$7.20", calls: "456" },
];

const topDocumentTypes = [
  { type: "Invoices", count: 387, percentage: 45, icon: <Receipt /> },
  { type: "Receipts", count: 234, percentage: 27, icon: <Description /> },
  { type: "Business Cards", count: 156, percentage: 18, icon: <Assignment /> },
  { type: "Forms", count: 89, percentage: 10, icon: <PictureAsPdf /> },
];

function NewDashboardPage() {
  const { state } = useAuth();
  const { user } = state;

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "#2e7d32";
      case "error":
        return "#d32f2f";
      case "warning":
        return "#ed6c02";
      default:
        return "#1976d2";
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
          >
            Document Intelligence Dashboard
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#1976d2", width: 40, height: 40 }}>
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </Avatar>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Welcome back, {user?.name || "Guest"}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.roles?.join(", ") || "User"} • Organization:{" "}
                {user?.orgId || "Default"}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Monitor your document scanning performance, Azure AI usage, and
            billing insights
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {scanningStats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    {stat.subtitle}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <TrendingUp sx={{ color: "#2e7d32", fontSize: 16 }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "#2e7d32", fontWeight: 500 }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Azure Services Usage */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card
              sx={{ height: 400, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Azure AI Services Usage
                </Typography>
                {azureServices.map((service, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {service.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", gap: 3, alignItems: "center" }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {service.calls} calls
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1976d2" }}
                        >
                          {service.cost}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={service.usage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e3f2fd",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#1976d2",
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {service.usage}% of monthly quota
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Document Types */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: 400 ,   boxShadow: "0 8px 25px rgba(0,0,0,0.15)",}}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Document Types Processed
                </Typography>
                <List sx={{ p: 0 }}>
                  {topDocumentTypes.map((doc, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 2 }}>
                      <ListItemIcon sx={{ color: "#1976d2" }}>
                        {doc.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {doc.type}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {doc.count} documents ({doc.percentage}%)
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={doc.percentage * 2}
                              sx={{
                                mt: 1,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "#f0f0f0",
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Scanning Activity */}
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Scanning Activity
                </Typography>
                <Grid container spacing={2}>
                  {recentScans.map((scan) => (
                    <Grid key={scan.id}>
                      <Paper
                        sx={{
                          p: 2,
                          border: "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              color: getActivityColor(scan.type),
                              mt: 0.5,
                            }}
                          >
                            {scan.icon}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {scan.title}
                              </Typography>
                              <Chip
                                label={scan.documentType}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "block",
                                mb: 1,
                                wordBreak: "break-word",
                              }}
                            >
                              {scan.description}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              {scan.time}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default NewDashboardPage;
